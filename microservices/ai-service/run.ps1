Write-Host "Starting AI Microservice on port 8000..." -ForegroundColor Green
Set-Location $PSScriptRoot
& "$PSScriptRoot\venv\Scripts\python.exe" main.py
