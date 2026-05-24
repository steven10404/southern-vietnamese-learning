$Here = Split-Path -Parent $MyInvocation.MyCommand.Path
$Cache = Join-Path $Here "cache"

if (Test-Path -LiteralPath $Cache) {
  Get-ChildItem -LiteralPath $Cache -Filter "*.wav" -File -ErrorAction SilentlyContinue | Remove-Item -Force
}

Write-Host "VieNeu-TTS cache cleared."
