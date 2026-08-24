Set WshShell = CreateObject("WScript.Shell")
Set FSO = CreateObject("Scripting.FileSystemObject")
ScriptDir = FSO.GetParentFolderName(WScript.ScriptFullName)

' Run pythonw.exe main.py with 0 (hidden window)
WshShell.CurrentDirectory = ScriptDir
WshShell.Run "pythonw.exe main.py --no-browser", 0, False
