import { Command, flags } from '@oclif/command';
import { commonFlags } from '../common';
import { createWithClientFromFlags } from '../wit/client';
import { zipDirToBuffer } from '../utils/zip';
import { withErrorsAndOutput } from '../utils/output';

export default class Import extends Command {
  static description = 'Create a new app with all the app data from the exported app.';

  static examples = [`$ wittycli import --name=witapp --private --file ./app.zip`];

  static flags = {
    ...commonFlags,
    file: flags.string({
      description: 'Path of the import file. A ZIP file containing all of your app data.',
      char: 'f',
      required: false,
    }),
    dir: flags.string({
      description: 'Path of the import directory. If set this command will ZIP provided directory and import it.',
      char: 'd',
      required: false,
    }),
    name: flags.string({
      description: 'Name of the new app.',
      char: 'n',
      required: true,
    }),
    private: flags.boolean({
      description: 'Private if flag provided.',
      char: 'p',
      required: false,
    }),
  };

  async run() {
    const { flags } = this.parse(Import);

    await withErrorsAndOutput(
      async () => {
        const wittyClient = createWithClientFromFlags(flags);

        if (flags.file) {
          const result = await wittyClient.import.post(
            {
              name: flags.name,
              private: flags.private,
            },
            flags.file,
          );
          return result;
        }
        if (flags.dir) {
          const buffer = zipDirToBuffer(flags.dir);
          const result = await wittyClient.import.post(
            {
              name: flags.name,
              private: flags.private,
            },
            buffer,
          );
          return result;
        }
        this.error(`You need to provide one of the 'file' or 'dir' params.`);
      },
      this,
      flags.dot,
    );
  }
}
