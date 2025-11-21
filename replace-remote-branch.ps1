<#
replace-remote-branch.ps1

This script force-pushes a single local branch to a remote branch (Option B) and optionally pushes tags.
It is less destructive than a full mirror (it only replaces the specified branch and tags if chosen).

USAGE:
  Open PowerShell in the repository root (C:\Users\USER\mern-blog) and run:
    .\replace-remote-branch.ps1

WARNING: Force-pushing a branch is destructive for that branch on the remote. Create a backup first if unsure.
#>

param()

$defaultRemote = 'https://github.com/PLP-MERN-Stack-Development/mern-stack-integration-neemmyy.git'
Write-Host "This script will force-push a single branch to the remote repository (Option B)." -ForegroundColor Yellow
Write-Host "Default remote: $defaultRemote`n"

$remoteUrl = Read-Host "Enter remote URL to push to (or press Enter to use default)"
if ([string]::IsNullOrWhiteSpace($remoteUrl)) { $remoteUrl = $defaultRemote }

$localBranch = Read-Host "Enter local branch to push (default: main)"
if ([string]::IsNullOrWhiteSpace($localBranch)) { $localBranch = 'main' }

$remoteBranch = Read-Host "Enter remote branch name to replace (press Enter to use same as local)"
if ([string]::IsNullOrWhiteSpace($remoteBranch)) { $remoteBranch = $localBranch }

Write-Host "\nTarget remote: $remoteUrl" -ForegroundColor Cyan
Write-Host "Local branch: $localBranch -> Remote branch: $remoteBranch`n" -ForegroundColor Cyan

$confirm = Read-Host "Type YES to continue (this will force-push and may overwrite remote branch)"
if ($confirm -ne 'YES') { Write-Host "Aborted by user." -ForegroundColor Green; exit 0 }

# Ask about backup
$doBackup = Read-Host "Create a mirror backup of the remote first? (recommended) (Y/n)"
if ([string]::IsNullOrWhiteSpace($doBackup)) { $doBackup = 'Y' }

if ($doBackup -match '^[Yy]') {
    $timestamp = Get-Date -Format yyyyMMdd-HHmmss
    $tempDir = Join-Path $env:TEMP "mern-backup-$timestamp.git"
    Write-Host "Creating mirror backup to: $tempDir" -ForegroundColor Yellow
    try {
        git clone --mirror $remoteUrl $tempDir
        if ($LASTEXITCODE -ne 0) { throw "git clone --mirror failed with exit code $LASTEXITCODE" }
        $zipPath = "$tempDir.zip"
        Compress-Archive -Path $tempDir -DestinationPath $zipPath -Force
        Write-Host "Backup created: $zipPath" -ForegroundColor Green
    }
    catch {
        Write-Host "Warning: Backup failed: $_" -ForegroundColor Red
        $continueOnFail = Read-Host "Continue without backup? (y/N)"
        if ($continueOnFail -notmatch '^[Yy]') { Write-Host "Aborting."; exit 1 }
    }
}

# Ensure current folder is a git repo and branch exists
if (-not (Test-Path .git)) {
    Write-Host "No .git directory found — initializing a new git repository and committing all files." -ForegroundColor Yellow
    git init
    git add -A
    git commit -m "Replace remote branch with local MERN blog" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Note: commit may have failed if there were no changes or no author configured." -ForegroundColor Yellow
    }
}

# Verify local branch exists; if not, create it from HEAD
$branches = git branch --list $localBranch | ForEach-Object { $_.Trim() }
if (-not $branches) {
    Write-Host "Local branch '$localBranch' not found. Creating it from current HEAD." -ForegroundColor Yellow
    git checkout -B $localBranch
    if ($LASTEXITCODE -ne 0) { Write-Host "Failed to create branch. Exiting." -ForegroundColor Red; exit 1 }
}
else {
    Write-Host "Local branch '$localBranch' exists." -ForegroundColor Green
}

# Add or update remote named 'target'
try { git remote remove target 2>$null } catch { }
git remote add target $remoteUrl
if ($LASTEXITCODE -ne 0) { Write-Host "Failed to add remote. Exiting." -ForegroundColor Red; exit 1 }

Write-Host "About to run: git push --force target $localBranch:$remoteBranch" -ForegroundColor Yellow
$finalConfirm = Read-Host "Type PUSH to perform the force-push (case-sensitive)"
if ($finalConfirm -ne 'PUSH') { Write-Host "Aborted by user." -ForegroundColor Green; exit 0 }

# Perform the force push for the branch
Write-Host "Pushing branch..." -ForegroundColor Cyan
git push --force target $localBranch:$remoteBranch
if ($LASTEXITCODE -ne 0) {
    Write-Host "git push failed with exit code $LASTEXITCODE" -ForegroundColor Red
    Write-Host "If you used HTTPS, ensure you can authenticate (use a PAT). For SSH, ensure your key is added to the agent and GitHub." -ForegroundColor Yellow
    exit 1
}
Write-Host "Branch pushed successfully." -ForegroundColor Green

# Ask whether to push tags
$pushTags = Read-Host "Push tags as well? (y/N)"
if ($pushTags -match '^[Yy]') {
    Write-Host "Pushing tags..." -ForegroundColor Cyan
    git push --tags --force target
    if ($LASTEXITCODE -ne 0) { Write-Host "git push --tags failed with exit code $LASTEXITCODE" -ForegroundColor Red }
    else { Write-Host "Tags pushed successfully." -ForegroundColor Green }
}

Write-Host "Done. Verify remote on GitHub or run: git ls-remote target" -ForegroundColor Cyan
