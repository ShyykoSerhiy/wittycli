import { Command, flags } from '@oclif/command';
import { commonFlags } from '../common';
import { createWithClientFromFlags, MessageGetResponse, WittyClient } from '../wit/client';
import { withErrorsAndOutput } from '../utils/output';
import { promises } from 'fs';
import chalk from 'chalk';
import Bottleneck from 'bottleneck';

type TestRule = MessageGetResponse;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { dot, ...commonFlagsWithoutDot } = commonFlags;

const runTest = async (
  testRule: TestRule,
  wittyClient: WittyClient,
): Promise<{ testRule: TestRule; error?: Error }> => {
  const { text } = testRule;
  try {
    const result = await wittyClient.message.get({
      q: text,
    });
    const actualIntent = result.intents[0];
    const expectedIntent = testRule.intents[0];
    if (actualIntent.name !== expectedIntent.name) {
      return {
        testRule,
        error: new Error(
          `Test "${text}" returned incorrect intent. Expected :"${expectedIntent.name}". Actual: "${actualIntent.name}"`,
        ),
      };
    }
    if (actualIntent.confidence < expectedIntent.confidence) {
      return {
        testRule,
        error: new Error(
          `Test "${text}" confidence degraded. Expected :"${expectedIntent.confidence}". Actual: "${actualIntent.confidence}"`,
        ),
      };
    }
    return { testRule };
  } catch (error) {
    return { testRule, error };
  }
};

export default class Test extends Command {
  static description = 'Tests the wittycli app with the provided file of expected utterances.';

  static examples = [`$ wittycli test --file="./example/test.json"`];

  static flags = {
    ...commonFlagsWithoutDot,
    file: flags.string({
      description: `Filepath of the file with utterances in format of the Array<ResponseOfTheMessageAPI>`,
      char: 'f',
      required: true,
    }),
    parallel: flags.integer({
      description: `Max amount of parallel requests`,
      char: 'p',
      required: false,
      default: 10,
    }),
  };

  async run() {
    const { flags } = this.parse(Test);
    const bottleneck = new Bottleneck({ maxConcurrent: flags.parallel });

    await withErrorsAndOutput(async () => {
      this.log(
        chalk.yellow(
          [
            '---------------------------------------------------',
            '----                wittycli test                ----',
            '---------------------------------------------------',
          ].join('\n'),
        ),
      );
      const startTime = new Date();

      const wittyClient = createWithClientFromFlags(flags);
      const testRules: TestRule[] = JSON.parse(await promises.readFile(flags.file, 'utf8'));
      const resultPromises = testRules.map((testRule) => {
        return bottleneck.schedule(() => {
          return runTest(testRule, wittyClient);
        });
      });
      const results = await Promise.all(resultPromises);
      const failedTests = results.filter((t) => t.error);

      const tests = testRules.length;
      const time = new Date().getTime() - startTime.getTime();
      const failed = failedTests.length;

      this.log(
        [
          `Tests                 ${tests}`, // amount of tests
          `Time                  ${time}`, // how long it took to run all tests
          `Failed                ${failed}`, // how much tests failed
        ].join('\n'),
      );

      if (failed) {
        const errors = failedTests.map((failedTest) => {
          return chalk.red(
            [
              `Testcase              ${failedTest.testRule.text}`,
              `Message               ${failedTest.error?.message}`,
              '',
            ].join('\n'),
          );
        });

        this.log(
          chalk.red(
            [
              '---------------------------------------------------',
              '----               failed tests                ----',
              '---------------------------------------------------',
              ...errors,
            ].join('\n'),
          ),
        );
        throw new Error('There were failing tests.');
      }
    }, this);
  }
}
