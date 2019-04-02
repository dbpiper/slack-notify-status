// tslint:disable-next-line: no-reference
/// <reference path="./config/types/slack-notify/index.d.ts" />

import moment from 'moment';
import slackNotify from 'slack-notify';

export interface FormattedDuration {
  milliseconds: number;
  seconds: number;
  minutes: number;
}

type GetMessageFunction = () => string;
type Message = string | GetMessageFunction;

export interface SlackNotifyStatusOptions {
  slackUrl: string;
  slackChannel: string;
  successMessage?: Message;
  failureMessage?: Message;
  includeTime?: boolean;
  scriptName?: string;
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

  private static _isError = (
    error: string | undefined | Error,
  ): error is Error => error instanceof Error;

  private static _isString = (message: Message): message is string =>
    typeof message === 'string';

  private static _isBoolean = (
    booleanLike: boolean | undefined,
  ): booleanLike is boolean => typeof booleanLike === 'boolean';

  private _startTime!: moment.Moment;
  private _options: SlackNotifyStatusOptions;

  /**
   * Creates an instance of SlackNotifyStatus.
   * @param {SlackNotifyStatusOptions} options The options to use to configure
   * SlackNotifyStatus, basically these are used to setup the slack endpoint
   * and messaging options.
   * @memberof SlackNotifyStatus
   */
  constructor(options: SlackNotifyStatusOptions) {
    const defaultOptions: Partial<SlackNotifyStatusOptions> = {
      includeTime: true,
      scriptName: 'Verification',
    };
    const combinedOptions = {
      ...defaultOptions,
      ...options,
    };
    // give it a default start time, however this really should be done
    // by the user in their own code. Having this here though means that
    // it will at least be somewhat close to correct even without the user
    // doing anything.
    this.startTimer();
    this._options = combinedOptions;
  }
  /**
   *
   * @function
   * @param {boolean} [success=true] Indicates whether or not to send slack the
   * success message, if it is not Truthy then then the failure message will
   * be send to slack instead.
   * @param {boolean} [mock=false] Indicates whether or not the method actually
   * sends a real message to slack. This is disabled by default, since the whole
   * point of the module is to send slack messages, however if you are using
   * this module as part of a verify script then it may be annoying during
   * debugging to get tons of slack messages all day. In this case, you may want
   * to turn it off until you have finished debugging.
   */
  public slackSendMessage = (success: boolean = true, mock: boolean = false) =>
    new Promise((resolve, reject) => {
      if (!mock) {
        const message = this.getSlackMessageLazy(success);

        this._slackSendMessageNetwork(resolve, reject, message);
      } else {
        resolve('mocked slack send message');
      }
    });

  public startTimer = () => {
    this._startTime = moment();
  };

  /**
   * Gets the amount of time that has elapsed since the
   * `slackNotifyStatus.startTimer` function was called. In other words,
   * how long a task has taken to complete.
   *
   *
   * @returns The elapsed time in milliseconds.
   * @function
   * @memberof SlackNotifyStatus
   */
  public getElapsedTime = () => {
    const endTime = moment();

    return endTime.diff(this._startTime);
  };

  /**
   * Gets the slack message which will be sent after applying all of the
   * options which were used to initialize and configure the
   * SlackNotifyStatus instance object.
   *
   * Strict version, which means that it will evaluate the Message. Meaning,
   * that if it is of type GetMessageFunction instead of string, then the
   * GetMessageFunction function will be called. Thus, evaluating the
   * GetMessageFunction to a raw string.
   *
   * @returns The slack message which will be sent.
   * @function
   * @memberof SlackNotifyStatus
   */
  public getSlackMessageStrict = (success: boolean = true): string => {
    const timeTakenString = SlackNotifyStatus.getTimeTakenString(
      this.getElapsedTime(),
    );

    if (SlackNotifyStatus._isBoolean(success)) {
      if (success) {
        return this._evaluateMessage(this._getSuccessMessage(timeTakenString));
      }

      return this._evaluateMessage(this._getFailureMessage(timeTakenString));
    }

    // this can't be reached with typescript, however it **is** possible
    // without typechecking (in vanilla JS).
    return this._evaluateMessage(this._getFailureMessage(timeTakenString));
  };

  /**
   * Gets the slack message which will be sent after applying all of the
   * options which were used to initialize and configure the
   * SlackNotifyStatus instance object.
   *
   * Lazy version, which means that it **won't** evaluate the Message
   * if it is a GetMessageFunction instead of a string.
   *
   * @returns The slack message which will be sent.
   * @function
   * @memberof SlackNotifyStatus
   */
  public getSlackMessageLazy = (success: boolean = true): string => {
    const timeTakenString = SlackNotifyStatus.getTimeTakenString(
      this.getElapsedTime(),
    );

    if (SlackNotifyStatus._isBoolean(success)) {
      if (success) {
        return this._evaluateMessage(this._getSuccessMessage(timeTakenString));
      }

      return this._evaluateMessage(this._getFailureMessage(timeTakenString));
    }

    // this can't be reached with typescript, however it **is** possible
    // without typechecking (in vanilla JS).
    return this._evaluateMessage(this._getFailureMessage(timeTakenString));
  };

  private _evaluateMessage = (messageLike: string | GetMessageFunction) => {
    if (SlackNotifyStatus._isString(messageLike)) {
      return messageLike;
    }

    return messageLike();
  };

  private _slackSendMessageNetwork = (
    resolve: (message: string) => void,
    reject: (error: Error) => void,
    messageLike: string | GetMessageFunction,
  ) => {
    const _slack = slackNotify(this._options.slackUrl);
    const rawMessage = this._evaluateMessage(messageLike);
    _slack.send(
      {
        channel: this._options.slackChannel,
        text: rawMessage,
      },
      (error: undefined | string | Error) => {
        if (SlackNotifyStatus._isError(error)) {
          reject(error);
        } else {
          resolve('slack message sent successfully!');
        }
      },
    );
  };

  private _getSuccessMessage = (timeTaken: string) => {
    if (this._options.successMessage) {
      return this._options.successMessage;
    }

    return `${
      this._options.scriptName
    } script finished successfully in ${timeTaken}.`;
  };

  private _getFailureMessage = (timeTaken: string) => {
    if (this._options.failureMessage) {
      return this._options.failureMessage;
    }

    return `${this._options.scriptName} script failed after ${timeTaken}!`;
  };
}

export default SlackNotifyStatus;
