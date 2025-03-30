; AutoHotkey v1.0 script to run a Stata do-file from an external text editor
; Parameter order: 1=statapath, 2=statawin, 3=statacmd, 4=dofile

; Get command line parameters
statapath = %1%
if (statapath = "")
{
    MsgBox, 16, Error, Missing Stata path parameter!
    ExitApp
}

statawin = %2%
if (statawin = "")
    statawin := "Stata/MP 18.0" ; Default window title

statacmd = %3%
if (statacmd = "")
    statacmd := "^1" ; Default hotkey Ctrl+1

dofile = %4%
if (dofile = "")
{
    MsgBox, 16, Error, Missing do-file path parameter!
    ExitApp
}

; Set fixed delays (milliseconds)
SetWinDelay, 200
SetKeyDelay, 10

; Check if Stata is already open
IfWinExist, %statawin%
{
    WinActivate
    WinWaitActive
    ; Activate command window and select text
    Send, %statacmd%
    Sleep, 100
    Send, ^a
    ; Run do-file with quotes for paths containing spaces
    clipboard = do "%dofile%"
    Sleep, 100
    Send, ^v{Enter}
}
Else
{
    Run, %statapath%
    WinWaitActive, %statawin%
    ; Activate command window
    Send, %statacmd%
    ; Run do-file with quotes for paths containing spaces
    clipboard = do "%dofile%"
    Sleep, 800
    Send, ^v{Enter}
}

; End of script