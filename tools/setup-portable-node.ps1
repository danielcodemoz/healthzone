param(
    [string]$Version = "22.15.0",
    [string]$DestExe = ""
)

$ErrorActionPreference = "Stop"

if (-not $DestExe) {
    $DestExe = Join-Path $PSScriptRoot "node-portable\node.exe"
}

$destDir = Split-Path $DestExe -Parent
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

if (Test-Path $DestExe) {
    Write-Host "  Portable Node.js already cached."
    exit 0
}

# 1) Copy from local Node installation (fast, no download)
$localNode = (Get-Command node -ErrorAction SilentlyContinue).Source
if ($localNode -and (Test-Path $localNode)) {
    Write-Host "  Copying Node.js from: $localNode"
    Copy-Item -Path $localNode -Destination $DestExe -Force
    Write-Host "  Done."
    exit 0
}

# 2) Download (only if Node is not installed locally)
$zip = Join-Path $env:TEMP "node-v$Version-win-x64.zip"
$url = "https://nodejs.org/dist/v$Version/node-v$Version-win-x64.zip"
Write-Host "  Node.js not found locally. Downloading v$Version ..."
Write-Host "  URL: $url"
Write-Host "  (This may take 1-3 minutes. Please wait.)"

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$curl = Get-Command curl.exe -ErrorAction SilentlyContinue
if ($curl) {
    & curl.exe -L --retry 3 --retry-delay 2 --progress-bar -o $zip $url
    if ($LASTEXITCODE -ne 0) {
        Write-Error "curl download failed (exit code $LASTEXITCODE)"
        exit 1
    }
} else {
    Write-Host "  Downloading with PowerShell..."
    $progressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing
}

if (-not (Test-Path $zip)) {
    Write-Error "Download failed: zip file not created."
    exit 1
}

$zipSize = (Get-Item $zip).Length / 1MB
Write-Host ("  Downloaded {0:N1} MB. Extracting..." -f $zipSize)

$tmp = Join-Path $env:TEMP "hz-node-extract"
if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
Expand-Archive -Path $zip -DestinationPath $tmp -Force

$src = Join-Path $tmp "node-v$Version-win-x64\node.exe"
if (-not (Test-Path $src)) {
    Write-Error "node.exe not found inside the downloaded zip."
    exit 1
}

Copy-Item -Path $src -Destination $DestExe -Force
Remove-Item $zip -Force -ErrorAction SilentlyContinue
Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "  Done."
exit 0
