param([switch]$Crm)
$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$settings = @{}
foreach ($line in Get-Content -LiteralPath (Join-Path $projectRoot 'crm/.env.production.local')) {
  if ($line -match '^([A-Z][A-Z0-9_]*)=(.*)$') { $settings[$matches[1]] = $matches[2].Trim().Trim('"').Trim("'") }
}
if ($settings['VITE_SUPABASE_URL'] -ne 'https://xyhrscvywupxfinwxdup.supabase.co' -or $settings['VITE_SUPABASE_PUBLISHABLE_KEY'] -notmatch '^sb_publishable_[A-Za-z0-9_-]+$') { throw 'Verified Production CMS settings required.' }
$buildEnvironment = @{
  SITE_SUPABASE_URL = $settings['VITE_SUPABASE_URL']
  SITE_SUPABASE_PUBLISHABLE_KEY = $settings['VITE_SUPABASE_PUBLISHABLE_KEY']
  VITE_SUPABASE_URL = $settings['VITE_SUPABASE_URL']
  VITE_SUPABASE_PUBLISHABLE_KEY = $settings['VITE_SUPABASE_PUBLISHABLE_KEY']
  ARTICLE_DATA_MODE = 'supabase'
  PORTFOLIO_DATA_MODE = 'supabase'
  VERCEL_ENV = 'production'
}
$previous = @{}
foreach ($name in $buildEnvironment.Keys) {
  $previous[$name] = [Environment]::GetEnvironmentVariable($name, 'Process')
  [Environment]::SetEnvironmentVariable($name, $buildEnvironment[$name], 'Process')
}
Push-Location -LiteralPath $projectRoot
try {
  if ($Crm) { npm run build:crm } else { npm run build }
  if ($LASTEXITCODE -ne 0) { throw 'Production build failed.' }
} finally {
  Pop-Location
  foreach ($name in $previous.Keys) { [Environment]::SetEnvironmentVariable($name, $previous[$name], 'Process') }
}
