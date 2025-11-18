# uni-app UI库安装脚本

Write-Host "开始下载UI组件库..." -ForegroundColor Green

# 创建临时下载目录
$tempDir = "temp_downloads"
if (!(Test-Path $tempDir)) {
    New-Item -ItemType Directory -Path $tempDir
}

Write-Host "正在下载 uv-ui..." -ForegroundColor Yellow
# 下载 uv-ui 最新版本
$uvUiUrl = "https://github.com/climblee/uv-ui/archive/refs/heads/master.zip"
Invoke-WebRequest -Uri $uvUiUrl -OutFile "$tempDir\uv-ui.zip"

Write-Host "正在下载 uview-ui..." -ForegroundColor Yellow  
# 下载 uview-ui 最新版本
$uviewUrl = "https://github.com/umicro/uView2.0/archive/refs/heads/master.zip"
Invoke-WebRequest -Uri $uviewUrl -OutFile "$tempDir\uview-ui.zip"

Write-Host "下载完成，请手动解压并放入 uni_modules 目录" -ForegroundColor Green
Write-Host "或者使用 HBuilderX 插件市场安装：" -ForegroundColor Cyan
Write-Host "uv-ui: https://ext.dcloud.net.cn/plugin?id=10715" -ForegroundColor Blue
Write-Host "uview-ui: https://ext.dcloud.net.cn/plugin?id=1593" -ForegroundColor Blue
