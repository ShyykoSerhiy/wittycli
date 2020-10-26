import { Command } from '@oclif/command';
import { pick } from 'dot-object';

export const withErrorsAndOutput = async (func: () => Promise<object | void>, command: Command, dotPath?: string) => {
  try {
    const response = await func();

    if (response) {
      if (dotPath) {
        const dotObj = pick(dotPath, response);
        if (typeof dotObj === 'object') {
          command.log(JSON.stringify(dotObj));
        } else {
          command.log(dotObj);
        }
      } else {
        command.log(JSON.stringify(response));
      }
    }
  } catch (error) {
    command.error(error);
  }
};
