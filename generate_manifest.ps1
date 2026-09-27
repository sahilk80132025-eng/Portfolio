$baseDir = "D:\Graphics\Portfolio\Ui Ux Portfolio\Portfolio\assets\vexma"
$validExts = @(".jpg", ".jpeg", ".webp", ".png", ".gif", ".mp4", ".webm")

function Get-Files($folder) {
    $dirPath = Join-Path -Path $baseDir -ChildPath $folder
    if (-Not (Test-Path -Path $dirPath)) {
        return @()
    }
    
    $files = Get-ChildItem -Path $dirPath -Recurse -File | Where-Object { $validExts -contains $_.Extension.ToLower() }
    $results = @()
    foreach ($f in $files) {
        # Convert path to relative and replace backslashes with forward slashes
        $relativePath = $f.FullName.Substring($baseDir.Length - 12) # "assets\vexma" length is 12
        $relativePath = $relativePath -replace '\\', '/'
        $results += $relativePath
    }
    return $results
}

$brochures = Get-Files("brochure")
$newsletters = Get-Files("newsletter")
$carousels = Get-Files("caraousel")
$displayAds = Get-Files("Displayads")

$socialPosts = @()
$socialPosts += Get-Files("socialmedia")

$projects = Get-Files("project")
$videos = Get-Files("vexmavideo")

$manifest = @{
    brochures = $brochures
    newsletters = $newsletters
    carousels = $carousels
    displayAds = $displayAds
    socialPosts = $socialPosts
    projects = $projects
    videos = $videos
}

$json = $manifest | ConvertTo-Json -Depth 5 -Compress

$content = "const VEXMA_ASSETS = $json;"

Set-Content -Path "D:\Graphics\Portfolio\Ui Ux Portfolio\Portfolio\assets\js\vexma_assets.js" -Value $content
Write-Host "Successfully generated assets/js/vexma_assets.js"
