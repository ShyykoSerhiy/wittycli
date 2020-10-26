import { Command, flags } from '@oclif/command';
import { commonFlags } from '../common';
import { createWithClientFromFlags, createWitClient, ImportPostResponse } from '../wit/client';
import { zipDirToBuffer } from '../utils/zip';
import { withErrorsAndOutput } from '../utils/output';

const wait = (timeout: number) => {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, timeout);
  });
};

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
      default: false,
    }),
    wait: flags.boolean({
      description: 'If true the cli will wait for the app training to complete via long polling.',
      char: 'w',
      required: false,
    }),
  };

  async run() {
    const { flags } = this.parse(Import);

    await withErrorsAndOutput(
      async () => {
        const wittyClient = createWithClientFromFlags(flags);

        if (!flags.dir && !flags.file) {
          this.error(`You need to provide one of the 'file' or 'dir' params.`);
        }

        let result: ImportPostResponse | null = null;
        if (flags.file) {
          result = await wittyClient.import.post(
            {
              name: flags.name,
              private: flags.private,
            },
            flags.file,
          );
        }
        if (flags.dir) {
          const buffer = zipDirToBuffer(flags.dir);
          result = await wittyClient.import.post(
            {
              name: flags.name,
              private: flags.private,
            },
            buffer,
          );
        }
        const nonNullResult = result!;
        if (flags.wait) {
          const newWittyClient = createWitClient({ token: nonNullResult.access_token });
          let appStatus = await newWittyClient.apps.app.get({ app: nonNullResult.app_id });
          while (
            appStatus.training_status !== 'done' ||
            /* initial train wasn't scheduled yet */ appStatus.will_train_at.startsWith(/* magick year */ '1969')
          ) {
            // eslint-disable-next-line no-await-in-loop
            await wait(/** 10 seconds */ 10 * 1000);
            // eslint-disable-next-line no-await-in-loop
            appStatus = await newWittyClient.apps.app.get({ app: nonNullResult.app_id });
          }
        }
        return nonNullResult!;
      },
      this,
      flags.dot,
    );
  }
}
