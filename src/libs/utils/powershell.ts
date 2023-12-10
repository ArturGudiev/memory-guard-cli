import {exec, spawn} from "child_process";

export function runPowerShellCommand(command: string) {
  // Replace the PowerShell command with your own
  // Spawn pwsh.exe and send the PowerShell command
  const pwshProcess = spawn('pwsh.exe', ['-Command', command]);

  // Handle output
    pwshProcess.stdout.on('data', (data) => {
      console.log(`PowerShell output:\n${data}`);
    });
  //
  // Handle errors
    pwshProcess
}

export function psFocusOnApp(app: string) {
  runPowerShellCommand(`C:\\Programming\\PowerShell\\focus.ps1 ${app}`);
}
