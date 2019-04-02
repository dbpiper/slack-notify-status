// tslint:disable: no-magic-numbers

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
