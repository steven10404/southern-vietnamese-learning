param(
  [switch]$NoOpen,
  [switch]$NoStart
)

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$Port = 5178
$Url = "http://localhost:$Port/"

function Test-LearningSite {
  try {
    Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 2 | Out-Null
    return $true
  } catch {
    return $false
  }
}

function Get-NodePath {
  $defaultNode = Join-Path $env:ProgramFiles "nodejs\node.exe"
  if (Test-Path $defaultNode) {
    return $defaultNode
  }

  $nodeCommand = Get-Command node -ErrorAction SilentlyContinue
  if ($nodeCommand) {
    return $nodeCommand.Source
  }

  throw "Node.js was not found. Install Node.js or make sure node.exe is available in PATH."
}

if (-not (Test-LearningSite) -and -not $NoStart) {
  $nodePath = Get-NodePath

  Start-Process `
    -FilePath $nodePath `
    -ArgumentList "server.mjs" `
    -WorkingDirectory $ProjectRoot `
    -WindowStyle Hidden

  for ($i = 0; $i -lt 30; $i++) {
    if (Test-LearningSite) {
      break
    }
    Start-Sleep -Milliseconds 500
  }
}

if (-not $NoOpen) {
  Start-Process $Url
} else {
  Write-Output "Southern Vietnamese learning launcher OK: $Url"
}
