import { Command, flags } from '@oclif/command';
import { commonFlags } from '../../common';
import { withErrorsAndOutput } from '../../utils/output';
import { createWithClientFromFlags } from '../../wit/client';

export default class Post extends Command {
  static description = 'Creates a new app for an existing user.';

  static examples = [`$ wittycli apps create --name=witapp --lang=en --private --timezone=Europe/Brussels`];

  static flags = {
    ...commonFlags,
    name: flags.string({
      description: 'Name of the new app.',
      char: 'n',
      required: true,
    }),
    lang: flags.string({
      description: 'Language code, in the ISO 639-1 format.',
      char: 'l',
      required: true,
    }),
    private: flags.boolean({
      description: 'Private if flag provided.',
      char: 'p',
      required: false,
    }),
    timezone: flags.string({
      description: 'Default timezone of your app. Defaults to America/Los_Angeles.',
      char: 't',
      required: false,
    }),
  };

  static args = [];

  async run() {
    const { flags } = this.parse(Post);
    withErrorsAndOutput(
      async () => {
        const wittyClient = createWithClientFromFlags(flags);
        this.log(
          JSON.stringify(
            await wittyClient.apps.post({
              name: flags.name,
              lang: flags.lang,
              private: flags.private,
              timezone: flags.timezone,
            }),
          ),
        );
      },
      this,
      flags.dot,
    );
  }
}
