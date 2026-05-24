$ErrorActionPreference = "Stop"

$Here = Split-Path -Parent $MyInvocation.MyCommand.Path
$Venv = Join-Path $Here ".venv"
$BundledPython = "C:\Users\steve\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

if ($env:VIENEU_PYTHON) {
  $Python = $env:VIENEU_PYTHON
} elseif (Test-Path $BundledPython) {
  $Python = $BundledPython
} else {
  $Python = "python"
}

if (!(Test-Path $Venv)) {
  & $Python -m venv $Venv
}

$VenvPython = Join-Path $Venv "Scripts\python.exe"
& $VenvPython -m pip install --upgrade pip
& $VenvPython -m pip install -r (Join-Path $Here "requirements.txt")

Write-Host "VieNeu-TTS setup complete."
Write-Host "Start it with: .\start.ps1"
