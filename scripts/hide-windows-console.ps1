param(
    [Parameter(Mandatory = $true, Position = 0, ValueFromRemainingArguments = $true)]
    [string[]]$Binaries
)

$vswhere = Join-Path ${env:ProgramFiles(x86)} 'Microsoft Visual Studio\Installer\vswhere.exe'
if (-not (Test-Path -LiteralPath $vswhere -PathType Leaf)) {
    throw "Visual Studio locator was not found: $vswhere"
}

$editbin = & $vswhere -latest -products '*' -find 'VC\Tools\MSVC\**\bin\Hostx64\x64\editbin.exe' |
    Select-Object -First 1
if (-not $editbin) {
    throw 'Visual Studio editbin.exe was not found.'
}

foreach ($binary in $Binaries) {
    if (-not (Test-Path -LiteralPath $binary -PathType Leaf)) {
        throw "Binary was not found: $binary"
    }

    & $editbin '/SUBSYSTEM:WINDOWS' $binary
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to hide the console subsystem for $binary (exit code $LASTEXITCODE)."
    }
}
