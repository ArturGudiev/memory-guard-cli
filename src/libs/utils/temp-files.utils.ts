import { getRandomString, writeFileContent } from "ag-utils-lib";
import { writeStringToFile } from "./fs.lib";

const TEMP_FILES_PATH = 'C:\\temp\\';

/**
 * Creates a temp file and returns the path
 * @param name 
 */
export function createTempFile(name: string = '', content='', extension = ''): string {
    let localFileName = name + getRandomString()
    if (extension) {
        localFileName += '.' + extension;
    }
    const globalPath = TEMP_FILES_PATH + localFileName;
    // writeFileContent(globalPath, content);
    writeStringToFile(content, globalPath)
    return globalPath;
}