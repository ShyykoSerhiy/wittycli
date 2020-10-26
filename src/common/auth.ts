import { flags } from '@oclif/command';

export const authFlags = {
  auth: flags.string({
    description:
      'Wit.ai uses OAuth2 as an authorization layer. As such, every API request must contain an Authorize HTTP header with a token. Access tokens are app and user specific. Please do not share the token with anyone, nor post it publicly. You can obtain one in Settings for your ',
    char: 'a',
    env: 'WIT_AUTH_TOKEN',
    required: true,
  }),
};
