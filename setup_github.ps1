# setup_github.ps1
# Bulletproof script to automate Git setup for AtweAkshay portfolio repositories.

param(
    [Parameter(Mandatory=$true)]
    [string]$RepoName,
    
    [string]$GithubUser = "AtweAkshay"
)

Write-Host "`n🚀 Preparing to configure local Git repository for '$RepoName'..." -ForegroundColor Cyan

# 1. Initialize local repository
if (-not (Test-Path ".git")) {
    git init
    Write-Host "✅ Initialized Git repository." -ForegroundColor Green
} else {
    Write-Host "ℹ️ Git repository already initialized." -ForegroundColor Yellow
}

# 2. Stage files
Write-Host "Staging files..." -ForegroundColor Gray
git add .
Write-Host "✅ Staged files." -ForegroundColor Green

# 3. Create commit
Write-Host "Creating initial commit..." -ForegroundColor Gray
git commit -m "feat: PMT portfolio showcase - initial commit"
Write-Host "✅ Created initial commit." -ForegroundColor Green

# 4. Set branch to main
git branch -M main

# 5. Set remote origin
$RemoteUrl = "git@github.com:$GithubUser/$RepoName.git"
git remote remove origin 2>$null
git remote add origin $RemoteUrl
Write-Host "✅ Configured remote origin: $RemoteUrl" -ForegroundColor Green

Write-Host "`n🎉 SUCCESS: Local repository '$RepoName' is ready!" -ForegroundColor Green
Write-Host "--------------------------------------------------------" -ForegroundColor Gray
Write-Host "Step 1: Go to https://github.com/new and create a PUBLIC repository named: $RepoName" -ForegroundColor Cyan
Write-Host "Step 2: Push your local code to GitHub by running:" -ForegroundColor Cyan
Write-Host "  git push -u origin main" -ForegroundColor Yellow
Write-Host "--------------------------------------------------------" -ForegroundColor Gray
Write-Host "(If you prefer HTTPS over SSH, you can change the remote URL using:)" -ForegroundColor Gray
Write-Host "  git remote set-url origin https://github.com/$GithubUser/$RepoName.git" -ForegroundColor Gray
Write-Host "--------------------------------------------------------" -ForegroundColor Gray
Write-Host ""
