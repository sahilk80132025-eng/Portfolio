$files = @("index.html", "vexma.html", "paradise.html", "amora.html")
foreach ($f in $files) {
    if (Test-Path $f) {
        $c = Get-Content $f -Raw
        $c = $c -replace "Ã¢â‚¬â€ ","—"
        $c = $c -replace "â–¾","▾"
        $c = $c -replace "â€”","—"
        $c = $c -replace "â€œ","“"
        $c = $c -replace "â€™","’"
        $c = $c -replace "â— ","●"
        $c = $c -replace "â†’","→"
        $c = $c -replace "Â",""
        [System.IO.File]::WriteAllText((Get-Item $f).FullName, $c, [System.Text.Encoding]::UTF8)
    }
}
