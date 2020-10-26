import { flags } from '@oclif/command';

export const versionFlags = {
  version: flags.string({
    description: `Every request requires a version parameter either in the URL or in the headers. This parameter is a date that represents the "version" of the Wit API. We'll try to minimize backwards-incompatible changes we make to the API, but when we do make these changes, this parameter will allow you to continue to use the API as before and give you time to transition to the new implementation if you want. As of June 1st, 2014, requests that do not include a version parameter will hit the latest version of our API.`,
    char: 'v',
    required: false,
  }),
};
