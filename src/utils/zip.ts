import AdmZip from 'adm-zip';
import { promises } from 'fs';
import { join } from 'path';
import { downloadFile } from './download';

const tempFileName = async () => {
  const tmpDirPath = await promises.mkdtemp('witcli');
  return { tmpFilePath: join(tmpDirPath, 'witcli.zip'), tmpDirPath };
};

export const unzip = (file: string, directory: string) => {
  const zipFile = new AdmZip(file);
  zipFile.extractAllTo(directory, true);
};

export const unzipFromUrl = async (url: string, directory: string) => {
  const { tmpDirPath, tmpFilePath } = await tempFileName();
  try {
    await downloadFile(url, tmpFilePath);
    await promises.mkdir(directory, { recursive: true });
    unzip(tmpFilePath, directory);
  } finally {
    try {
      await promises.unlink(tmpFilePath);
    } finally {
      await promises.rmdir(tmpDirPath);
    }
  }
};

export const zipDirToBuffer = (dir: string) => {
  const zip = new AdmZip();
  zip.addLocalFolder(dir, 'witcli');
  return zip.toBuffer();
};
