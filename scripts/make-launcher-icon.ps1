$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$iconDir = Join-Path $projectRoot "assets\icons"
New-Item -ItemType Directory -Force -Path $iconDir | Out-Null

$pngPath = Join-Path $iconDir "cute-wife-launcher.png"
$icoPath = Join-Path $iconDir "cute-wife-launcher.ico"

$size = 256
$bitmap = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
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

$shadowBrush = New-Brush "#0b3d3f"
$shadowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
Add-RoundedRectangle $shadowPath 28 34 200 200 42
$graphics.FillPath($shadowBrush, $shadowPath)

$bgBrush = New-Brush "#147f86"
$bgPath = New-Object System.Drawing.Drawing2D.GraphicsPath
Add-RoundedRectangle $bgPath 22 24 200 200 42
$graphics.FillPath($bgBrush, $bgPath)

$creamBrush = New-Brush "#fff7ec"
$graphics.FillEllipse($creamBrush, 46, 42, 164, 164)

$hairBrush = New-Brush "#293339"
$hairPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$hairPath.AddBezier(75, 105, 75, 54, 181, 50, 183, 113)
$hairPath.AddBezier(183, 113, 187, 158, 164, 188, 129, 190)
$hairPath.AddBezier(129, 190, 88, 188, 64, 153, 75, 105)
$hairPath.CloseFigure()
$graphics.FillPath($hairBrush, $hairPath)

$faceBrush = New-Brush "#ffd7c2"
$graphics.FillEllipse($faceBrush, 82, 80, 92, 98)

$bangBrush = New-Brush "#293339"
$bangPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$bangPath.AddBezier(83, 103, 95, 72, 140, 63, 173, 101)
$bangPath.AddBezier(173, 101, 153, 94, 132, 106, 112, 120)
$bangPath.AddBezier(112, 120, 104, 103, 94, 107, 83, 103)
$bangPath.CloseFigure()
$graphics.FillPath($bangBrush, $bangPath)

$eyeBrush = New-Brush "#132324"
$graphics.FillEllipse($eyeBrush, 106, 126, 10, 13)
$graphics.FillEllipse($eyeBrush, 145, 126, 10, 13)

$blushBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(115, 240, 120, 128))
$graphics.FillEllipse($blushBrush, 91, 143, 22, 10)
$graphics.FillEllipse($blushBrush, 150, 143, 22, 10)

$smilePen = New-Pen "#9a3f43" 5
$graphics.DrawArc($smilePen, 116, 136, 34, 25, 18, 145)

$aoDaiBrush = New-Brush "#f7a64b"
$bodyPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$bodyPath.AddBezier(95, 176, 106, 164, 153, 164, 164, 176)
$bodyPath.AddLine(164, 176, 178, 217)
$bodyPath.AddLine(178, 217, 82, 217)
$bodyPath.AddLine(82, 217, 95, 176)
$bodyPath.CloseFigure()
$graphics.FillPath($aoDaiBrush, $bodyPath)

$collarPen = New-Pen "#fff7ec" 5
$graphics.DrawLine($collarPen, 118, 174, 130, 199)
$graphics.DrawLine($collarPen, 142, 174, 130, 199)

$heartBrush = New-Brush "#e85245"
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

Write-Output "PNG: $pngPath"
Write-Output "ICO: $icoPath"
