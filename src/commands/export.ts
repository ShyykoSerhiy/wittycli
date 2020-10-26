import { Command, flags } from '@oclif/command';
import { commonFlags } from '../common';
import { createWithClientFromFlags } from '../wit/client';
import { downloadFile } from '../utils/download';
import { unzipFromUrl } from '../utils/zip';
import { withErrorsAndOutput } from '../utils/output';

export default class Export extends Command {
  static description =
    'Exports Get a URL where you can download a ZIP file containing all of your app data. This ZIP file can be used to create a new app with the same data.';

  static examples = [`$ witcli export --output="./app.zip"`];

  static flags = {
    ...commonFlags,
    output: flags.string({
      description: 'Path of the output file. If set this command will download a ZIP file to a provided path.',
      char: 'o',
      required: false,
    }),
    dir: flags.string({
      description:
        'Path of the output directory. If set this command will download a ZIP file and unzip to a provided directory.',
      char: 'd',
      required: false,
    }),
  };

  async run() {
    const { flags } = this.parse(Export);

    withErrorsAndOutput(async () => {
      const witClient = createWithClientFromFlags(flags);
      const file = await witClient.export.get();

      if (flags.output) {
        this.log(`Downloading ZIP ${file.uri} to ${flags.output}`);
        await downloadFile(file.uri, flags.output);
        return;
      }
      if (flags.dir) {
        this.log(`Extracting ZIP ${file.uri} to ${flags.dir}`);
        await unzipFromUrl(file.uri, flags.dir);
        return;
      }
      this.log(JSON.stringify(file));
    }, this);
  }
}
