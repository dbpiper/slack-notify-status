// tslint:disable: no-magic-numbers

import _ from 'lodash';
import { CoreOptions } from 'request';
import { promisify } from 'util';
import { unchangingPartOfMessage } from './utils/message';

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

describe('slackNotifyStatus instance tests', () => {
  describe('slackNotifyStatus.slackSendMessage tests', () => {
    test('slack post message success test', async () => {
      const slackNotifyStatus = new SlackNotifyStatus({
        slackUrl: 'hello',
        slackChannel: 'hello',
      });

      const timeout = promisify(setTimeout);
      await timeout(1000);

      const result = await slackNotifyStatus.slackSendMessage(true, false);
      const unchangingResult = unchangingPartOfMessage(result.toString());
      expect(unchangingResult).toBe(
        'message:Verification script finished successfully',
      );
    });

    test('slack post message success test using default parameters', async () => {
      const slackNotifyStatus = new SlackNotifyStatus({
        slackUrl: 'hello',
        slackChannel: 'hello',
      });

      const timeout = promisify(setTimeout);
      await timeout(1000);

      const result = await slackNotifyStatus.slackSendMessage();
      const unchangingResult = unchangingPartOfMessage(result.toString());
      expect(unchangingResult).toBe(
        'message:Verification script finished successfully',
      );
    });

    test('slack post message success test with mocking enabled', async () => {
      const slackNotifyStatus = new SlackNotifyStatus({
        slackUrl: 'hello',
        slackChannel: 'hello',
      });

      const timeout = promisify(setTimeout);
      await timeout(1000);

      const result = await slackNotifyStatus.slackSendMessage(true, true);
      expect(result).toBe('mocked slack send message');
    });

    test('slack post message success test with failure message', async () => {
      const slackNotifyStatus = new SlackNotifyStatus({
        slackUrl: 'hello',
        slackChannel: 'hello',
      });

      const timeout = promisify(setTimeout);
      await timeout(1000);

      const result = await slackNotifyStatus.slackSendMessage(false, false);
      const unchangingResult = unchangingPartOfMessage(result.toString());
      expect(unchangingResult).toBe('message:Verification script failed');
    });

    test('slack post message failed test', async () => {
      const slackNotifyStatus = new SlackNotifyStatus({
        // special url which indicates a failure to the request mock
        slackUrl: 'fail',
        slackChannel: 'hello',
      });

      const timeout = promisify(setTimeout);
      await timeout(1000);

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

      const timeout = promisify(setTimeout);
      await timeout(1000);

      try {
        await slackNotifyStatus.slackSendMessage(true, true);
      } catch (error) {
        expect(error instanceof Error).toBe(true);
      }
    });
  });
});
