$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$oneDriveRoot = Join-Path $env:USERPROFILE "OneDrive"
$sourcePath = Get-ChildItem -LiteralPath $oneDriveRoot -Filter "HBJ959sbkAABAK3.jpg" -Recurse -ErrorAction Stop |
  Select-Object -First 1 -ExpandProperty FullName
if (-not $sourcePath) {
  throw "Source image was not found: HBJ959sbkAABAK3.jpg"
}
$iconDir = Join-Path $projectRoot "assets\icons"
New-Item -ItemType Directory -Force -Path $iconDir | Out-Null

$pngPath = Join-Path $iconDir "wife-image-launcher.png"
$icoPath = Join-Path $iconDir "wife-image-launcher.ico"

$source = [System.Drawing.Image]::FromFile($sourcePath)
$size = 256
$bitmap = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.Clear([System.Drawing.Color]::Transparent)

function New-Brush($hex) {
  return New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml($hex))
}

function New-Pen($hex, $width) {
  $pen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml($hex)), $width
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  return $pen
}

function Add-RoundedRectangle($path, $x, $y, $w, $h, $r) {
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
}

$shadowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
Add-RoundedRectangle $shadowPath 28 34 200 200 42
$graphics.FillPath((New-Brush "#2b1e2b"), $shadowPath)

$bgPath = New-Object System.Drawing.Drawing2D.GraphicsPath
Add-RoundedRectangle $bgPath 22 24 200 200 42
$graphics.FillPath((New-Brush "#7b5a80"), $bgPath)

$circle = New-Object System.Drawing.Drawing2D.GraphicsPath
$circle.AddEllipse(39, 35, 178, 178)
$graphics.FillEllipse((New-Brush "#fff7ec"), 33, 29, 190, 190)

$state = $graphics.Save()
$graphics.SetClip($circle)

# Crop to the face / hair area so the desktop icon remains readable at small sizes.
$crop = New-Object System.Drawing.Rectangle 820, 180, 1250, 1250
$dest = New-Object System.Drawing.Rectangle 39, 35, 178, 178
$graphics.DrawImage($source, $dest, $crop, [System.Drawing.GraphicsUnit]::Pixel)
$graphics.Restore($state)

$graphics.DrawEllipse((New-Pen "#fff7ec" 10), 39, 35, 178, 178)
$graphics.DrawEllipse((New-Pen "#3e2f48" 3), 45, 41, 166, 166)

$heartBrush = New-Brush "#ef5b67"
$heartPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$heartPath.AddBezier(181, 70, 181, 56, 202, 54, 204, 72)
$heartPath.AddBezier(204, 72, 206, 54, 227, 56, 227, 72)
$heartPath.AddBezier(227, 72, 227, 91, 204, 101, 204, 101)
$heartPath.AddBezier(204, 101, 181, 91, 181, 70, 181, 70)
$heartPath.CloseFigure()
$graphics.FillPath($heartBrush, $heartPath)

$badgeBrush = New-Brush "#0e666b"
$graphics.FillEllipse($badgeBrush, 36, 168, 58, 58)
$font = New-Object System.Drawing.Font("Segoe UI", 22, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$textBrush = New-Brush "#fff7ec"
$format = New-Object System.Drawing.StringFormat
$format.Alignment = [System.Drawing.StringAlignment]::Center
$format.LineAlignment = [System.Drawing.StringAlignment]::Center
$graphics.DrawString("SV", $font, $textBrush, (New-Object System.Drawing.RectangleF 36, 168, 58, 58), $format)

$bitmap.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)

$memoryStream = New-Object System.IO.MemoryStream
$bitmap.Save($memoryStream, [System.Drawing.Imaging.ImageFormat]::Png)
$pngBytes = $memoryStream.ToArray()
$memoryStream.Dispose()

$fileStream = [System.IO.File]::Open($icoPath, [System.IO.FileMode]::Create)
$writer = New-Object System.IO.BinaryWriter($fileStream)
$writer.Write([UInt16]0)
$writer.Write([UInt16]1)
$writer.Write([UInt16]1)
$writer.Write([Byte]0)
$writer.Write([Byte]0)
$writer.Write([Byte]0)
$writer.Write([Byte]0)
$writer.Write([UInt16]1)
$writer.Write([UInt16]32)
$writer.Write([UInt32]$pngBytes.Length)
$writer.Write([UInt32]22)
$writer.Write($pngBytes)
$writer.Close()
$fileStream.Close()

$graphics.Dispose()
$bitmap.Dispose()
$source.Dispose()

Write-Output "PNG: $pngPath"
Write-Output "ICO: $icoPath"
