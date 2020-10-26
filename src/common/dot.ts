import { flags } from '@oclif/command';

export const dotFlags = {
  dot: flags.string({
    description:
      'Use dot notation (https://github.com/rhalff/dot-object#pick-a-value-using-dot-notation) to retrieve a value from json response.',
    required: false,
  }),
};
