$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$distPath = Join-Path $projectRoot 'dist'
$outputRoot = Join-Path $projectRoot 'outputs/site-production'
$archivePath = Join-Path $outputRoot ('pixel-site-production-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.zip')
$settings = @{}
foreach ($line in Get-Content -LiteralPath (Join-Path $projectRoot 'crm/.env.production.local')) {
  if ($line -match '^([A-Z][A-Z0-9_]*)=(.*)$') { $settings[$matches[1]] = $matches[2].Trim().Trim('"').Trim("'") }
}
if ($settings['VITE_SUPABASE_URL'] -ne 'https://xyhrscvywupxfinwxdup.supabase.co' -or
    $settings['VITE_SUPABASE_PUBLISHABLE_KEY'] -notmatch '^sb_publishable_[A-Za-z0-9_-]+$') {
  throw 'Verified Production URL and publishable key are required.'
}
$buildSettings = @{
  SITE_SUPABASE_URL = $settings['VITE_SUPABASE_URL']
  SITE_SUPABASE_PUBLISHABLE_KEY = $settings['VITE_SUPABASE_PUBLISHABLE_KEY']
  VITE_SUPABASE_URL = $settings['VITE_SUPABASE_URL']
  VITE_SUPABASE_PUBLISHABLE_KEY = $settings['VITE_SUPABASE_PUBLISHABLE_KEY']
  ARTICLE_DATA_MODE = 'supabase'
  PORTFOLIO_DATA_MODE = 'supabase'
  NODE_ENV = 'production'
  VERCEL_ENV = 'production'
}
$previousEnvironment = @{}
foreach ($name in [Environment]::GetEnvironmentVariables('Process').Keys | Where-Object { $_ -like 'VITE_*' }) {
  $previousEnvironment[$name] = [Environment]::GetEnvironmentVariable($name, 'Process')
  [Environment]::SetEnvironmentVariable($name, $null, 'Process')
}
# Suppress unverified Vite values from the checkout's local development env.
# Turnstile needs a separately verified Production key before public form use.
$buildSettings['VITE_TURNSTILE_SITE_KEY'] = ''
foreach ($name in $buildSettings.Keys) {
  if (-not $previousEnvironment.ContainsKey($name)) { $previousEnvironment[$name] = [Environment]::GetEnvironmentVariable($name, 'Process') }
  [Environment]::SetEnvironmentVariable($name, $buildSettings[$name], 'Process')
}
Push-Location -LiteralPath $projectRoot
try {
  npm run build
  if ($LASTEXITCODE -ne 0) { throw 'Public site Production build failed.' }
  foreach ($path in @('index.html','assets','articles/index.html','articles/crm-upload-check-20261001/index.html','portfolio/index.html','sitemap.xml')) {
    if (-not (Test-Path -LiteralPath (Join-Path $distPath $path))) { throw "Missing static output: $path" }
  }
  foreach ($file in Get-ChildItem -LiteralPath $distPath -File -Recurse -Force) {
    if ($file.Name -match '^\.env|\.(?:pem|key|map)$') { throw "Unsafe build file: $($file.Name)" }
    if ($file.Extension -in @('.html','.js','.css','.json','.xml','.txt','.svg')) {
      $content = Get-Content -LiteralPath $file.FullName -Raw
      if ($content -match 'puyeoagdmzldjrbypcal|sb_secret_|sbp_[A-Za-z0-9_-]{8,}|-----BEGIN .*PRIVATE KEY-----') { throw "Staging or secret found: $($file.Name)" }
      foreach ($match in [regex]::Matches($content, 'https://[a-z0-9]+\.supabase\.co')) {
        if ($match.Value -ne $settings['VITE_SUPABASE_URL']) { throw "Foreign Supabase project: $($file.Name)" }
      }
      foreach ($match in [regex]::Matches($content, 'eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+')) {
        $encoded = $match.Value.Split('.')[1].Replace('-','+').Replace('_','/')
        $encoded = $encoded.PadRight([int]([Math]::Ceiling($encoded.Length / 4.0) * 4), '=')
        $claims = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($encoded)) | ConvertFrom-Json
        if ($claims.role -eq 'service_role') { throw 'Service-role credential in public build.' }
      }
    }
  }
  New-Item -ItemType Directory -Path $outputRoot -Force | Out-Null
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  [System.IO.Compression.ZipFile]::CreateFromDirectory($distPath, $archivePath)
  $archive = [System.IO.Compression.ZipFile]::OpenRead($archivePath)
  try {
    $entries = @($archive.Entries | ForEach-Object { $_.FullName.Replace('\','/') })
    if ('index.html' -notin $entries -or 'articles/crm-upload-check-20261001/index.html' -notin $entries) { throw 'ZIP root layout incorrect.' }
  } finally { $archive.Dispose() }
  Write-Output "Ready: $archivePath"
  Write-Output 'Production CMS snapshots only; no staging/secret credentials. Turnstile Production key still needs configuration.'
} finally {
  Pop-Location
  foreach ($name in $previousEnvironment.Keys) { [Environment]::SetEnvironmentVariable($name, $previousEnvironment[$name], 'Process') }
}
