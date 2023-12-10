import fs from 'fs';

export function writeStringToFile(content: string, filename: string): void {
    fs.writeFileSync(filename, content);
}