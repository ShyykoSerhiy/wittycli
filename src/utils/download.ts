import fetch from 'node-fetch';
import { writeFile } from 'fs';
import { promisify } from 'util';
const writeFilePromise = promisify(writeFile);

export const downloadFile = async (url: string, outputPath: string): Promise<void> => {
  return writeFilePromise(outputPath, Buffer.from(await (await fetch(url)).arrayBuffer()));
};
