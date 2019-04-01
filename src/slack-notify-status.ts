// tslint:disable-next-line: no-reference
/// <reference path="./config/types/slack-notify/index.d.ts" />

import moment from 'moment';
import slackNotify from 'slack-notify';

import SlackInfo from './config/gulp/helpers/slack-info';

/**
 * @interface FormattedDuration
 */
export interface FormattedDuration {
  milliseconds: number;
  seconds: number;
  minutes: number;
}

/**
 *
 * @module slack-notify-status
 * @class SlackNotifyStatus
 */
export class SlackNotifyStatus {
  public static getTimeTakenString = (timeTakenMs: number) => {
    const timeTaken = moment.duration(timeTakenMs, 'milliseconds');
    const formattedDuration = SlackNotifyStatus._makeFormattedDuration(
      timeTaken,
    );
    const millisecondsString = SlackNotifyStatus._pluralizeIfNeeded(
      formattedDuration.milliseconds,
      'millisecond',
    );
    const secondsString = SlackNotifyStatus._pluralizeIfNeeded(
      formattedDuration.seconds,
      'second',
    );
    const minutesString = SlackNotifyStatus._pluralizeIfNeeded(
      formattedDuration.minutes,
      'minute',
    );

    if (formattedDuration.minutes < 1 && formattedDuration.seconds < 1) {
      return `${formattedDuration.milliseconds} ${millisecondsString}`;
    }
    if (formattedDuration.minutes < 1) {
      return `${formattedDuration.seconds} ${secondsString}`;
    }
    if (formattedDuration.minutes === 1 && formattedDuration.seconds < 1) {
      return `${formattedDuration.minutes} ${minutesString}`;
    }

    return `${formattedDuration.minutes} ${minutesString} and ${
      formattedDuration.seconds
    } ${secondsString}`;
  };
  private static _pluralizeIfNeeded = (amount: number, unit: string) => {
    if (amount === 1) {
      return unit;
    }
    return `${unit}s`;
  };
  private static _makeFormattedDuration = (
    duration: moment.Duration,
  ): FormattedDuration => {
    const locale = 'en-US';
    const millisecondsInSecond = 1000;
    const formattingOptions: Intl.NumberFormatOptions = {
      maximumFractionDigits: 2,
    };
    const milliseconds = Number(
      duration.milliseconds().toLocaleString(locale, formattingOptions),
    );
    const seconds = Number(
      (duration.seconds() + milliseconds / millisecondsInSecond).toLocaleString(
        locale,
        formattingOptions,
      ),
    );
    const minutes = Number(
      duration.minutes().toLocaleString(locale, formattingOptions),
    );

    return {
      milliseconds,
      seconds,
      minutes,
    };
  };

  private _startTime!: moment.Moment;

  constructor() {
    // give it a default start time, however this really should be done
    // by the user in their own code. Having this here though means that
    // it will at least be somewhat close to correct even without the user
    // doing anything.
    this.startTimer();
  }
  /**
   *
   * @function
   * @param {boolean} [success=true]
   * @param {boolean} [mock=false] Indicates whether or not the method actually
   * sends a real message to slack. This is disabled by default, since the whole
   * point of the module is to send slack messages, however if you are using
   * this module as part of a verify script then it may be annoying during
   * debugging to get tons of slack messages all day. In this case, you may want
   * to turn it off until you have finished debugging.
   */
  public slackSendMessage = (success: boolean = true, mock: boolean = false) =>
    new Promise((resolve, _reject) => {
      if (!mock) {
        const message = this._getSlackMessage(success);

        this._slackSendMessageNetwork(resolve, message);
      }
    });

  public startTimer = () => {
    this._startTime = moment();
  };
  private _slackSendMessageNetwork = (resolve: () => void, message: string) => {
    const _slack = slackNotify(SlackInfo.url);
    _slack.send(
      {
        channel: SlackInfo.channel,
        text: message,
      },
      () => {
        resolve();
      },
    );
  };
  private _getSlackMessage = (success: boolean) => {
    const _endTime = moment();

    let message: string = '';

    const timeTakenMs = _endTime.diff(this._startTime);
    const timeTakenString = SlackNotifyStatus.getTimeTakenString(timeTakenMs);

    if (typeof success === 'boolean') {
      if (success) {
        message = `Verification script finished successfully in ${timeTakenString}.`;
      } else {
        message = `Verification script failed after ${timeTakenString}!`;
      }
    }

    return message;
  };
}

export default SlackNotifyStatus;
