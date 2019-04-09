// tslint:disable-next-line: no-reference
/// <reference path="./config/types/slack-notify/index.d.ts" />
import Timer from '@dbpiper/timer';
import slackNotify from 'slack-notify';

export interface SlackNotifyStatusOptions {
  slackUrl: string;
  slackChannel: string;
  timer?: Timer;
  scriptName?: string;
}

/**
 *
 * @module slack-notify-status
 * @class SlackNotifyStatus
 */
export class SlackNotifyStatus {
  private static isError(error: string | undefined | Error): error is Error {
    return error instanceof Error;
  }

  private static isDefined<T>(something: T | undefined): something is T {
    return typeof something !== 'undefined';
  }

  private _options: SlackNotifyStatusOptions;

  get timer(): Timer {
    if (SlackNotifyStatus.isDefined(this._options.timer)) {
      return this._options.timer;
    }

    // if the timer is not already created make a new one
    this._options.timer = new Timer();
    return this._options.timer;
  }

  /**
   * Creates an instance of SlackNotifyStatus.
   * @param {SlackNotifyStatusOptions} options The options to use to configure
   * SlackNotifyStatus, basically these are used to setup the slack endpoint
   * and messaging options.
   * @memberof SlackNotifyStatus
   */
  constructor(options: SlackNotifyStatusOptions) {
    const defaultOptions: Partial<SlackNotifyStatusOptions> = {
      timer: new Timer(),
      scriptName: 'Verification',
    };
    const combinedOptions = {
      ...defaultOptions,
      ...options,
    };
    this._options = combinedOptions;

    if (!SlackNotifyStatus.isDefined(this._options.timer)) {
      this._options.timer = new Timer();
    }
  }
  /**
   *
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
  public slackSendMessage(
    success: boolean = true,
    mock: boolean = false,
  ): Promise<string | Error> {
    return new Promise((resolve, reject) => {
      if (!mock) {
        const message = this.makeMessage(success);

        this.slackSendMessageNetwork(resolve, reject, message);
      } else {
        resolve('mocked slack send message');
      }
    });
  }

  private makeMessage(success: boolean) {
    let duration = '';

    if (SlackNotifyStatus.isDefined(this._options.timer)) {
      duration = `${this._options.timer.stop()}`;
    }

    let scriptName = '';
    if (SlackNotifyStatus.isDefined(this._options.scriptName)) {
      scriptName = this._options.scriptName;
    }

    if (success) {
      return `${scriptName} script finished successfully in ${duration}.`;
    }

    return `${scriptName} script failed after ${duration}!`;
  }

  private slackSendMessageNetwork(
    resolve: (message: string) => void,
    reject: (error: Error) => void,
    message: string,
  ) {
    const _slack = slackNotify(this._options.slackUrl);
    _slack.send(
      {
        channel: this._options.slackChannel,
        text: message,
      },
      (error: undefined | string | Error) => {
        if (SlackNotifyStatus.isError(error)) {
          reject(new Error(`${error}`));
        } else {
          resolve(`message:${message} sent successfully!`);
        }
      },
    );
  }
}

export default SlackNotifyStatus;
