import { deleteFile, waitForUserInput } from "ag-utils-lib";
import { createTempFile } from "./temp-files.utils";
import { exec } from "child_process";
import {psFocusOnApp} from "./powershell";

/**
 * Returns a content inside a specifig tag
 * @param content some HTML content 
 * @param tag -- default is div 
 * @returns 
 */
export function inTag(content: string, tag = 'div'): string {
    return `<${tag}>${content}</${tag}>`
}

export function htmlNewLine(): string {
    return '<br>';
}

export function getImageTag(imagePath: string, width?: string) {
  return `<img src="file:///${imagePath}" ${width ? 'width="' + width + '"' : ''}>`;
}

export function createTempHTMLFile(htmlContent: string): string {
    const filePath = createTempFile('html-file', htmlContent, 'html');
    return filePath;
}


export function showFileInBrowser(filename: string): void {
    exec(`start firefox ${filename}`);
}

export async function showHTMLInBrowser(html: string, focusOnPowerShell=true): Promise<void> {
  const filePath = createTempHTMLFile(html);
  showFileInBrowser(filePath);
  if (focusOnPowerShell) {
    psFocusOnApp('PowerShell');
  }
  await waitForUserInput();
  deleteFile(filePath);
}


export async function showImageInBrowser(imagePath: string, width?: string): Promise<void> {
  const imageTag = getImageTag(imagePath, width);
  await showHTMLInBrowser(imageTag);
}
