import { Command, flags } from '@oclif/command';
import { commonFlags } from '../common';
import { createWithClientFromFlags, MessageGetResponse, WittyClient } from '../wit/client';
import { withErrorsAndOutput } from '../utils/output';
import { promises } from 'fs';
import { isEqual } from 'lodash';
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
    // testing intents
    const actualIntent = result.intents[0];
    const expectedIntent = testRule.intents[0];
    if (actualIntent.name !== expectedIntent.name) {
      return {
        testRule,
        error: new Error(
          `Test "${text}" returned incorrect intent. Expected: "${expectedIntent.name}". Actual: "${actualIntent.name}"`,
        ),
      };
    }
    if (actualIntent.confidence < expectedIntent.confidence) {
      return {
        testRule,
        error: new Error(
          `Test "${text}" confidence degraded. Expected: "${expectedIntent.confidence}". Actual: "${actualIntent.confidence}"`,
        ),
      };
    }
    // testing entities
    if (!testRule.entities) {
      // no need to test entities if they are not provided.
      return { testRule };
    }
    const actualEntities = result.entities;
    const expectedEntities = testRule.entities;
    const actualEntitiesKeys = Object.keys(actualEntities);
    const expectedEntitiesKeys = Object.keys(expectedEntities);

    const actualEntitiesJSON = JSON.stringify(actualEntities);
    const expectedEntitiesJSON = JSON.stringify(expectedEntities);
    const entitiesErrorMessagePart = `Expected entitites: ${expectedEntitiesJSON}.\nActual entities: ${actualEntitiesJSON}`;
    if (actualEntitiesKeys.length !== expectedEntitiesKeys.length) {
      return {
        testRule,
        error: new Error(
          `Test "${text}" entities mismatch. Different amount of entity types. Expected :"${expectedEntitiesKeys.length}". Actual: "${actualEntitiesKeys.length}.\n${entitiesErrorMessagePart}"`,
        ),
      };
    }
    for (const actualEntityKey of actualEntitiesKeys) {
      if (!(actualEntityKey in expectedEntities)) {
        return {
          testRule,
          error: new Error(
            `Test "${text}" entities mismatch. ${actualEntityKey} is not in expected entities ${JSON.stringify(
              expectedEntitiesKeys,
            )}. Expected :"${expectedEntitiesKeys.length}". Actual: "${
              actualEntitiesKeys.length
            }.\n${entitiesErrorMessagePart}"`,
          ),
        };
      }

      const actualEntityList = actualEntities[actualEntityKey];
      const expectedEntityList = expectedEntities[actualEntityKey];
      if (actualEntityList.length !== expectedEntityList.length) {
        return {
          testRule,
          error: new Error(
            `Test "${text}" entities mismatch. Entity ${actualEntityKey} has incorect amount of entities. Expected :"${expectedEntityList.length}". Actual: "${actualEntityList.length}.\n${entitiesErrorMessagePart}"`,
          ),
        };
      }

      for (let i = 0; i < actualEntityList.length; i++) {
        const actualEntity = actualEntityList[i];
        const expectedEntity = expectedEntityList[i];

        for (const expectedEntityField of Object.keys(expectedEntity)) {
          /* eslint max-depth: ["error", 6] */
          if (expectedEntityField === 'confidence') {
            if (actualEntity.confidence < expectedEntity.confidence) {
              return {
                testRule,
                error: new Error(
                  `Test "${text}" entities mismatch. Confidence for entity ${actualEntityKey} degraded. Expected: "${expectedEntity.confidence}". Actual: "${actualEntity.confidence}"\n${entitiesErrorMessagePart}`,
                ),
              };
            }
            continue;
          }

          const actualEntityFieldValue = (actualEntity as any)[expectedEntityField];
          const expectedEntityFieldValue = (expectedEntity as any)[expectedEntityField];
          if (!isEqual(actualEntityFieldValue, expectedEntityFieldValue)) {
            return {
              testRule,
              error: new Error(
                `Test "${text}" entities mismatch. Field "${expectedEntityField}" for entity "${actualEntityKey}" has unexpected value. Expected: "${JSON.stringify(
                  expectedEntityFieldValue,
                )}". Actual: "${JSON.stringify(actualEntityFieldValue)}"\n${entitiesErrorMessagePart}`,
              ),
            };
          }
        }
      }
    }

    return { testRule };
  } catch (error) {
    return { testRule, error };
  }
};

export default class Test extends Command {
  static description = 'Tests the wittycli app with the provided file of expected utterances and entities.';

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
