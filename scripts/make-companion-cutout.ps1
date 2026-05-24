$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$sourcePath = Join-Path $projectRoot "assets\images\wife-companion.png"
$outputPath = Join-Path $projectRoot "assets\images\wife-companion-cutout.png"

$source = [System.Drawing.Image]::FromFile($sourcePath)
$size = 360
$bitmap = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.Clear([System.Drawing.Color]::Transparent)

$clip = New-Object System.Drawing.Drawing2D.GraphicsPath
$clip.AddEllipse(12, 4, 336, 336)
$state = $graphics.Save()
$graphics.SetClip($clip)

# Crop tighter around the generated portrait so the floating avatar feels like a character,
# not a square app tile.
$crop = New-Object System.Drawing.Rectangle 46, 0, 420, 420
$dest = New-Object System.Drawing.Rectangle 0, 0, 360, 360
$graphics.DrawImage($source, $dest, $crop, [System.Drawing.GraphicsUnit]::Pixel)
$graphics.Restore($state)

$shadowPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(70, 20, 33, 28)), 4
$graphics.DrawEllipse($shadowPen, 12, 4, 336, 336)
$shadowPen.Dispose()

$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$bitmap.Dispose()
$source.Dispose()

Write-Output "Cutout: $outputPath"
