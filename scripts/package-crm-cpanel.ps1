$ErrorActionPreference = 'Stop'

$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$crmRoot = Join-Path $projectRoot 'crm'
$envFile = Join-Path $crmRoot '.env.production.local'
$distPath = Join-Path $crmRoot 'dist'
$archiveRoot = Join-Path $projectRoot 'outputs/crm-production'
$archivePath = Join-Path $archiveRoot 'pixel-crm-production-cpanel.zip'

if (-not (Test-Path -LiteralPath $envFile)) {
  throw 'Create crm/.env.production.local with the production Supabase URL and publishable key before packaging.'
}

$settings = @{}
foreach ($line in Get-Content -LiteralPath $envFile) {
  if ($line -match '^([A-Z][A-Z0-9_]*)=(.*)$') {
    $settings[$matches[1]] = $matches[2].Trim().Trim('"').Trim("'")
  }
}
foreach ($name in @('VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY')) {
  if ([string]::IsNullOrWhiteSpace($settings[$name])) {
    throw "Missing $name in crm/.env.production.local."
  }
}
$supabaseUri = $null
if (-not [Uri]::TryCreate($settings['VITE_SUPABASE_URL'], [UriKind]::Absolute, [ref]$supabaseUri) -or
    $supabaseUri.Scheme -ne 'https' -or
    $supabaseUri.AbsolutePath -ne '/') {
  throw 'VITE_SUPABASE_URL must be the HTTPS project base URL, without /rest/v1/ or another path.'
}
if ($settings['VITE_SUPABASE_URL'] -match 'puyeoagdmzldjrbypcal') {
  throw 'The configured Supabase project is staging. Use the separate production project for this package.'
}
if ($settings['VITE_SUPABASE_PUBLISHABLE_KEY'] -notmatch '^sb_publishable_[A-Za-z0-9_-]+$') {
  throw 'Only a Supabase publishable key is allowed in the CRM package.'
}

# Process variables take precedence over every Vite .env file. Preserve the
# caller's environment while ensuring this build never inherits staging values.
$buildSettings = @{
  VITE_SUPABASE_URL = $settings['VITE_SUPABASE_URL']
  VITE_SUPABASE_PUBLISHABLE_KEY = $settings['VITE_SUPABASE_PUBLISHABLE_KEY']
  ARTICLE_DATA_MODE = 'fixture'
  PORTFOLIO_DATA_MODE = 'fixture'
  SITE_SUPABASE_URL = $null
  SITE_SUPABASE_PUBLISHABLE_KEY = $null
  NODE_ENV = 'production'
}
$previousEnvironment = @{}
$viteVariables = [Environment]::GetEnvironmentVariables('Process').Keys |
  Where-Object { $_ -like 'VITE_*' }
foreach ($name in $viteVariables) {
  $previousEnvironment[$name] = [Environment]::GetEnvironmentVariable($name, 'Process')
  [Environment]::SetEnvironmentVariable($name, $null, 'Process')
}
foreach ($name in $buildSettings.Keys) {
  if (-not $previousEnvironment.ContainsKey($name)) {
    $previousEnvironment[$name] = [Environment]::GetEnvironmentVariable($name, 'Process')
  }
  [Environment]::SetEnvironmentVariable($name, $buildSettings[$name], 'Process')
}

Push-Location -LiteralPath $projectRoot
try {
  npm run build:crm
  if ($LASTEXITCODE -ne 0) { throw 'CRM build failed.' }
  Copy-Item -LiteralPath (Join-Path $crmRoot 'cpanel.htaccess') -Destination (Join-Path $distPath '.htaccess') -Force
  foreach ($entry in @('index.html', 'assets', '.htaccess')) {
    if (-not (Test-Path -LiteralPath (Join-Path $distPath $entry))) {
      throw "Missing build entry: $entry."
    }
  }
  $javascript = (Get-ChildItem -LiteralPath (Join-Path $distPath 'assets') -Filter '*.js' |
    ForEach-Object { Get-Content -LiteralPath $_.FullName -Raw }) -join "`n"
  if (-not $javascript.Contains($settings['VITE_SUPABASE_URL']) -or
      -not $javascript.Contains($settings['VITE_SUPABASE_PUBLISHABLE_KEY'])) {
    throw 'The compiled CRM does not contain the expected production connection.'
  }
  $forbiddenToken = '(?:sb_secret_|sbp_)[A-Za-z0-9_-]{8,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'
  foreach ($file in Get-ChildItem -LiteralPath $distPath -File -Recurse -Force) {
    if ($file.Name -match '^\.env|\.(?:pem|key|map)$') {
      throw "Sensitive or source-map file in build: $($file.Name)."
    }
    if ($file.Extension -in @('.html', '.js', '.css', '.json', '.xml', '.txt', '.svg', '.htaccess')) {
      $content = Get-Content -LiteralPath $file.FullName -Raw
      if ($content -match 'puyeoagdmzldjrbypcal|pixel-git-[A-Za-z0-9-]+\.vercel\.app' -or
          $content -match $forbiddenToken) {
        throw "Staging configuration or sensitive token detected in $($file.Name)."
      }
      foreach ($origin in [regex]::Matches($content, 'https://[a-z0-9]+\.supabase\.co')) {
        if ($origin.Value -ne $settings['VITE_SUPABASE_URL'].TrimEnd('/')) {
          throw "Unexpected Supabase project in $($file.Name)."
        }
      }
      foreach ($publicKey in [regex]::Matches($content, 'sb_publishable_[A-Za-z0-9_-]+')) {
        if ($publicKey.Value -ne $settings['VITE_SUPABASE_PUBLISHABLE_KEY']) {
          throw "Unexpected Supabase publishable key in $($file.Name)."
        }
      }
      foreach ($token in [regex]::Matches($content, 'eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+')) {
        $payload = $token.Value.Split('.')[1].Replace('-', '+').Replace('_', '/')
        $payload = $payload.PadRight([int]([Math]::Ceiling($payload.Length / 4.0) * 4), '=')
        try { $claims = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($payload)) | ConvertFrom-Json }
        catch { throw "Unexpected embedded JWT in $($file.Name)." }
        if ($claims.role -eq 'service_role') { throw "Embedded service-role credential in $($file.Name)." }
      }
    }
  }
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  New-Item -ItemType Directory -Path $archiveRoot -Force | Out-Null
  if (Test-Path -LiteralPath $archivePath) { Remove-Item -LiteralPath $archivePath -Force }
  [System.IO.Compression.ZipFile]::CreateFromDirectory($distPath, $archivePath)
  $archive = [System.IO.Compression.ZipFile]::OpenRead($archivePath)
  try {
    $entries = @($archive.Entries | ForEach-Object { $_.FullName.Replace('\', '/') })
    if ('index.html' -notin $entries -or '.htaccess' -notin $entries -or
        -not ($entries | Where-Object { $_ -like 'assets/*.js' })) {
      throw 'ZIP must contain index.html, .htaccess, and assets directly at its root.'
    }
  } finally { $archive.Dispose() }
  Write-Output 'Verified: production connection, credential scan, and ZIP root structure.'
  Write-Output "Ready: $archivePath"
} finally {
  Pop-Location
  foreach ($name in $previousEnvironment.Keys) {
    [Environment]::SetEnvironmentVariable($name, $previousEnvironment[$name], 'Process')
  }
}
