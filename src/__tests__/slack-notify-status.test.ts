// tslint:disable: no-magic-numbers

import _ from 'lodash';
import { CoreOptions } from 'request';
import { unchangingPartOfDefaultMessage } from './utils/message';

jest.mock('request', () => {
  const moduleObject = {
    post: jest.fn(
      (
        uri: string,
        _options: CoreOptions,
        callback: (
          error: string | Error | undefined,
          response: { body: string },
        ) => void,
      ) => {
        if (uri === 'fail') {
          const body = 'failure';
          callback(new Error(body), { body });
        } else {
          const body = 'ok';
          callback(undefined, { body });
        }
      },
    ),
  };
  return moduleObject;
});

import SlackNotifyStatus from '../slack-notify-status';

describe('SlackNotifyStatus static tests', () => {
  describe('SlackNotifyStatus.getTimeTakenString tests', () => {
    describe('< 1 second tests', () => {
      test('getTimeTakenString should give correct ms for integer', () => {
        expect(SlackNotifyStatus.getTimeTakenString(50)).toEqual(
          '50 milliseconds',
        );
      });

      test('exactly 1 ms', () => {
        expect(SlackNotifyStatus.getTimeTakenString(1)).toEqual(
          '1 millisecond',
        );
      });

      test('getTimeTakenString should give correct ms for real number', () => {
        expect(SlackNotifyStatus.getTimeTakenString(50.135)).toEqual(
          '50.14 milliseconds',
        );
      });
    });

    describe('>= 1 second && < 1 minute tests', () => {
      test('getTimeTakenString should give correct seconds for integer', () => {
        expect(SlackNotifyStatus.getTimeTakenString(50 * 1000)).toEqual(
          '50 seconds',
        );
      });

      test('getTimeTakenString should give correct seconds for real number', () => {
        expect(SlackNotifyStatus.getTimeTakenString(50.135 * 1000)).toEqual(
          '50.14 seconds',
        );
      });

      test('exactly 1 second', () => {
        expect(SlackNotifyStatus.getTimeTakenString(1 * 1000)).toEqual(
          '1 second',
        );
      });
    });

    describe('>= 1 minute tests', () => {
      test('getTimeTakenString should give correct min and sec for integer', () => {
        expect(SlackNotifyStatus.getTimeTakenString(50 * 1000 * 2)).toEqual(
          '1 minute and 40 seconds',
        );
      });

      test('getTimeTakenString should give correct min and sec for real number', () => {
        expect(SlackNotifyStatus.getTimeTakenString(50.135 * 1000 * 2)).toEqual(
          '1 minute and 40.27 seconds',
        );
      });

      test('exactly 1 minute', () => {
        expect(SlackNotifyStatus.getTimeTakenString(1 * 1000 * 60)).toEqual(
          '1 minute',
        );
      });

      test('plural minutes and integer ms', () => {
        expect(SlackNotifyStatus.getTimeTakenString(50 * 1000 * 5)).toEqual(
          '4 minutes and 10 seconds',
        );
      });
    });
  });
});

describe('slackNotifyStatus instance tests', () => {
  describe('slackNotifyStatus.slackSendMessage tests', () => {
    test('slack post message success test', async () => {
      const slackNotifyStatus = new SlackNotifyStatus({
        slackUrl: 'hello',
        slackChannel: 'hello',
      });
      slackNotifyStatus.startTimer();
      const result = await slackNotifyStatus.slackSendMessage(true, false);
      expect(typeof result).toBe('string');
    });

    test('slack post message success test, custom messages', async () => {
      const slackNotifyStatus = new SlackNotifyStatus({
        slackUrl: 'hello',
        slackChannel: 'hello',
        successMessage: 'it worked!',
        failureMessage: "it didn't work",
      });
      slackNotifyStatus.startTimer();
      const result = await slackNotifyStatus.slackSendMessage(true, false);
      expect(typeof result).toBe('string');
    });

    test('slack post message success test, custom message functions', async () => {
      const slackNotifyStatus = new SlackNotifyStatus({
        slackUrl: 'hello',
        slackChannel: 'hello',
        successMessage: () => 'it worked!',
        failureMessage: () => "it didn't work",
      });
      slackNotifyStatus.startTimer();
      const result = await slackNotifyStatus.slackSendMessage(true, false);
      expect(typeof result).toBe('string');
    });

    test('slack post message success test with mocking enabled', async () => {
      const slackNotifyStatus = new SlackNotifyStatus({
        slackUrl: 'hello',
        slackChannel: 'hello',
      });
      slackNotifyStatus.startTimer();
      const result = await slackNotifyStatus.slackSendMessage(true, true);
      expect(typeof result).toBe('string');
    });

    test('slack post message success test with failure message', async () => {
      const slackNotifyStatus = new SlackNotifyStatus({
        slackUrl: 'hello',
        slackChannel: 'hello',
      });
      slackNotifyStatus.startTimer();
      const result = await slackNotifyStatus.slackSendMessage(false, false);
      expect(typeof result).toBe('string');
    });

    test('slack post message success test with failure message, with custom messages', async () => {
      const slackNotifyStatus = new SlackNotifyStatus({
        slackUrl: 'hello',
        slackChannel: 'hello',
        successMessage: 'it worked!',
        failureMessage: "it didn't work",
      });
      slackNotifyStatus.startTimer();
      const result = await slackNotifyStatus.slackSendMessage(false, false);
      expect(typeof result).toBe('string');
    });

    test(`slack post message success test with failure message, with custom \
    message functions`, async () => {
      const slackNotifyStatus = new SlackNotifyStatus({
        slackUrl: 'hello',
        slackChannel: 'hello',
        successMessage: () => 'it worked!',
        failureMessage: () => "it didn't work",
      });
      slackNotifyStatus.startTimer();
      const result = await slackNotifyStatus.slackSendMessage(false, false);
      expect(typeof result).toBe('string');
    });

    test('slack post message failed test', async () => {
      const slackNotifyStatus = new SlackNotifyStatus({
        // special url which indicates a failure to the request mock
        slackUrl: 'fail',
        slackChannel: 'hello',
      });
      slackNotifyStatus.startTimer();
      try {
        await slackNotifyStatus.slackSendMessage(true, false);
      } catch (error) {
        expect(error instanceof Error).toBe(true);
      }
    });

    test('slack post message failed test with mocking enabled', async () => {
      const slackNotifyStatus = new SlackNotifyStatus({
        // special url which indicates a failure to the request mock
        slackUrl: 'fail',
        slackChannel: 'hello',
      });
      slackNotifyStatus.startTimer();
      try {
        await slackNotifyStatus.slackSendMessage(true, true);
      } catch (error) {
        expect(error instanceof Error).toBe(true);
      }
    });
  });

  describe('slackNotifyStatus.getSlackMessage tests', () => {
    test('default messages work', () => {
      const slackNotifyStatus = new SlackNotifyStatus({
        slackUrl: 'hello',
        slackChannel: 'hello',
      });
      slackNotifyStatus.startTimer();

      const message = slackNotifyStatus.getSlackMessageStrict();
      const unchangingMessagePart = unchangingPartOfDefaultMessage(message);
      expect(unchangingMessagePart).toEqual(
        'Verification script finished successfully',
      );
    });
  });
});
