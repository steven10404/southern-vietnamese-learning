$ErrorActionPreference = "Stop"

$Here = Split-Path -Parent $MyInvocation.MyCommand.Path
$VenvPython = Join-Path $Here ".venv\Scripts\python.exe"

if (!(Test-Path $VenvPython)) {
  Write-Host "VieNeu-TTS venv not found. Run setup first:"
  Write-Host "  cd `"$Here`""
  Write-Host "  .\setup.ps1"
  exit 1
}

if (!$env:VIENEU_MODE) {
  $env:VIENEU_MODE = "turbo"
}

& $VenvPython (Join-Path $Here "server.py")
