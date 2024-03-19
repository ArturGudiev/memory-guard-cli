import {exec, spawn} from "child_process";

export function runPowerShellCommand(command: string) {
  const pwshProcess = spawn('pwsh.exe', ['-Command', command]);

    pwshProcess.stdout.on('data', (data: any) => {
      console.log(`PowerShell output:\n${data}`);
    });
    pwshProcess
}

export function psFocusOnApp(app: string) {
  runPowerShellCommand(`C:\\Programming\\PowerShell\\focus.ps1 ${app}`);
}
