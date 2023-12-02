#!/usr/bin/env ts-node
import { program } from 'commander';
import { exec } from 'child_process';

program
  .command('open-electron-window')
  .description('Open an Electron window')
  .action(() => {
    exec('electron bld/src/libs/popup/electron-window.js', (error, stdout) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      console.log(`Electron window opened:\n${stdout}`);
    });
  });

program.parse(process.argv);
