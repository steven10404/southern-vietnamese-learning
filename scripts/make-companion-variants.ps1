$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$generatedRoot = Join-Path $env:USERPROFILE ".codex\generated_images"
$outputDir = Join-Path $projectRoot "assets\images"

$sources = Get-ChildItem -Recurse -LiteralPath $generatedRoot -Filter "*.png" |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 3 -ExpandProperty FullName

if ($sources.Count -lt 3) {
  throw "Expected at least 3 generated companion images."
}

for ($i = 0; $i -lt $sources.Count; $i++) {
  $index = $i + 2
  $sourcePath = $sources[$i]
  $fullPath = Join-Path $outputDir "wife-companion-$index.png"
  $cutoutPath = Join-Path $outputDir "wife-companion-cutout-$index.png"

  $source = [System.Drawing.Image]::FromFile($sourcePath)

  $full = New-Object System.Drawing.Bitmap 512, 512, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gFull = [System.Drawing.Graphics]::FromImage($full)
  $gFull.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $gFull.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $gFull.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $gFull.DrawImage($source, 0, 0, 512, 512)
  $full.Save($fullPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $gFull.Dispose()
  $full.Dispose()

  $size = 360
  $cutout = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($cutout)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([System.Drawing.Color]::Transparent)

  $clip = New-Object System.Drawing.Drawing2D.GraphicsPath
  $clip.AddEllipse(12, 4, 336, 336)
  $state = $g.Save()
  $g.SetClip($clip)
  $g.DrawImage($source, 0, 0, 360, 360)
  $g.Restore($state)

  $outline = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(70, 20, 33, 28)), 4
  $g.DrawEllipse($outline, 12, 4, 336, 336)
  $outline.Dispose()

  $cutout.Save($cutoutPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $cutout.Dispose()
  $source.Dispose()

  Write-Output "Variant ${index}: $cutoutPath"
}
