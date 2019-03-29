// tslint:disable: no-magic-numbers

import { getTimeTakenString } from '../index';

describe('slack-notify-status tests', () => {
  test('geTimeTakenString should give only ms for < 1 sec', () => {
    expect(getTimeTakenString(50)).toEqual('50 milliseconds');
  });

  test('geTimeTakenString should give only ms for < 1 sec with decimals', () => {
    expect(getTimeTakenString(50.135)).toEqual('50.14 milliseconds');
  });
});
