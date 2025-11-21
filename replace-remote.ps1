<#
replace-remote.ps1

This script helps you safely overwrite (mirror-push) a remote GitHub repository with the current local repository.

USAGE (PowerShell):
  Open PowerShell in the repository root (C:\Users\USER\mern-blog) and run:
    .\replace-remote.ps1

WARNING: This will replace the remote repository's branches and tags with your local refs. BACKUP first.
#>

param()

# Default remote URL (the one you provided). You may change it when prompted.
$defaultRemote = 'https://github.com/PLP-MERN-Stack-Development/mern-stack-integration-neemmyy.git'

Write-Host "This script will perform a MIRROR push to replace the remote repository with your local repository." -ForegroundColor Yellow
Write-Host "Remote target (default): $defaultRemote`n"

$remoteUrl = Read-Host "Enter remote URL to overwrite (or press Enter to use default)"
if ([string]::IsNullOrWhiteSpace($remoteUrl)) { $remoteUrl = $defaultRemote }

Write-Host "\nTarget remote: $remoteUrl" -ForegroundColor Cyan

$confirm = Read-Host "Type YES to continue (this will be destructive on the remote)"
if ($confirm -ne 'YES') {
    Write-Host "Aborted by user. No changes made." -ForegroundColor Green
    exit 0
}

# Ask about backup
$doBackup = Read-Host "Create a mirror backup of the remote first? (Y/n)"
if ([string]::IsNullOrWhiteSpace($doBackup)) { $doBackup = 'Y' }

# Create backup if requested
if ($doBackup -match '^[Yy]') {
    $timestamp = Get-Date -Format yyyyMMdd-HHmmss
    $tempDir = Join-Path $env:TEMP "mern-backup-$timestamp.git"
    Write-Host "Creating mirror backup to: $tempDir" -ForegroundColor Yellow
    try {
        git clone --mirror $remoteUrl $tempDir
        if ($LASTEXITCODE -ne 0) { throw "git clone --mirror failed with exit code $LASTEXITCODE" }
        $zipPath = "$tempDir.zip"
        Write-Host "Compressing backup to: $zipPath" -ForegroundColor Yellow
        Compress-Archive -Path $tempDir -DestinationPath $zipPath -Force
        Write-Host "Backup created: $zipPath" -ForegroundColor Green
    }
    catch {
        Write-Host "Warning: Backup failed: $_" -ForegroundColor Red
        $continueOnFail = Read-Host "Continue without backup? (y/N)"
        if ($continueOnFail -notmatch '^[Yy]') { Write-Host "Aborting."; exit 1 }
    }
}

# Ensure script is running from repository root (or prompt for confirmation)
$pwdPath = Get-Location
Write-Host "\nCurrent working directory: $pwdPath" -ForegroundColor Cyan
$confirmCwd = Read-Host "Proceed using this folder as the source to mirror-push? (Y/n)"
if ([string]::IsNullOrWhiteSpace($confirmCwd)) { $confirmCwd = 'Y' }
if ($confirmCwd -notmatch '^[Yy]') { Write-Host "Aborted."; exit 0 }

# Ensure we have a git repo
if (-not (Test-Path .git)) {
    Write-Host "No .git directory found — initializing a new git repository and committing all files." -ForegroundColor Yellow
    git init
    git add -A
    git commit -m "Replace remote with local MERN blog" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Note: commit may have failed if there were no changes or no author configured.\nYou can configure git and create a commit manually if needed." -ForegroundColor Yellow
    }
}
else {
    Write-Host "Found existing .git repository." -ForegroundColor Green
}

# Add target remote named 'target' (remove existing 'target' if present)
try {
    git remote remove target 2>$null
} catch { }

git remote add target $remoteUrl
if ($LASTEXITCODE -ne 0) { Write-Host "Failed to add remote. Exiting." -ForegroundColor Red; exit 1 }

Write-Host "About to run: git push --mirror target --force" -ForegroundColor Yellow
$finalConfirm = Read-Host "Type PUSH to perform the mirror push (case-sensitive)"
if ($finalConfirm -ne 'PUSH') { Write-Host "Aborted by user."; exit 0 }

# Perform the mirror push
Write-Host "Pushing --mirror (this may take a while for large repos) ..." -ForegroundColor Cyan
git push --mirror target --force
if ($LASTEXITCODE -ne 0) {
    Write-Host "git push failed with exit code $LASTEXITCODE" -ForegroundColor Red
    Write-Host "If you used HTTPS, ensure you can authenticate (use a PAT). For SSH, ensure your key is added to the agent and GitHub." -ForegroundColor Yellow
    exit 1
}

Write-Host "Mirror push completed successfully." -ForegroundColor Green
Write-Host "Verify the remote repository on GitHub (web UI) or run: git ls-remote target" -ForegroundColor Cyan

Write-Host "If you need to restore the backup you created, push the mirror backup back to the remote:" -ForegroundColor Yellow
Write-Host "  cd <backup-folder>.git; git push --mirror <remote-url>" -ForegroundColor Yellow

Write-Host "Done." -ForegroundColor Green
