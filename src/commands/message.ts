import { Command, flags } from '@oclif/command';
import { commonFlags } from '../common';
import { createWithClientFromFlags } from '../wit/client';
import { withErrorsAndOutput } from '../utils/output';

export default class Import extends Command {
  static description = 'Returns the extracted meaning from a sentence, based on the app data.';

  static examples = [`$ witcli message --query="Set temperature to 70 degrees" --numberofintents=8`];

  static flags = {
    ...commonFlags,
    query: flags.string({
      description: `User's query, between 0 and 280 characters.`,
      char: 'q',
      required: true,
    }),
    tag: flags.string({
      description: 'A specific tag you want to use for the query. See GET /apps/:app/tags.',
      char: 't',
      required: false,
    }),
    numberofintents: flags.integer({
      description:
        'The maximum number of n-best intents and traits you want to get back. The default is 1, and the maximum is 8.',
      char: 'n',
      required: false,
      default: 1,
    }),
  };

  async run() {
    const { flags } = this.parse(Import);

    withErrorsAndOutput(
      async () => {
        const witClient = createWithClientFromFlags(flags);

        return witClient.message.get({
          q: flags.query,
          tag: flags.tag,
          n: flags.numberofintents,
        });
      },
      this,
      flags.dot,
    );
  }
}
