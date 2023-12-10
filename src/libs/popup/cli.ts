#!/usr/bin/env ts-node
import { program } from 'commander';
import { exec } from 'child_process';

program
  .command('open-electron-window')
  .description('Open an Electron window')
  .option('-p, --path <value>', 'Description of your option')
  .action((options) => {
    console.log('path', options.path)
    // exec('electron bld/src/libs/popup/electron-window.js', (error, stdout) => {
    //   if (error) {
    //     console.error(`Error: ${error.message}`);
    //     return;
    //   }
    //   console.log(`Electron window opened:\n${stdout}`);
    // });
  });

program
  .argument('')

program.parse(process.argv);
