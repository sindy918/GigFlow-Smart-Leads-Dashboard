# Git initialization and commit script for GigFlow
Write-Host "Initializing local Git repository..."
git init

Write-Host "Configuring remote GitHub repository link..."
git remote add origin https://github.com/sindy918/GigFlow-Smart-Leads-Dashboard.git

Write-Host "Staging all clean source files (excluding node_modules/dist/.env)..."
git add .

Write-Host "Creating initial commit..."
git commit -m "Initial commit - GigFlow Smart Leads Dashboard"

Write-Host "Setting active branch to main..."
git branch -M main

Write-Host "--------------------------------------------------------"
Write-Host "✅ Local repository successfully initialized and committed!"
Write-Host "Now run the following command to push to your GitHub repo:"
Write-Host "👉  git push -u origin main"
Write-Host "--------------------------------------------------------"
