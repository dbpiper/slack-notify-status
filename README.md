# slack-notify-status

[![Build Status](https://travis-ci.com/dbpiper/slack-notify-status.svg?branch=master)](https://travis-ci.com/dbpiper/slack-notify-status)
[![npm version](http://img.shields.io/npm/v/@dbpiper/slack-notify-status.svg?style=flat)](https://npmjs.org/package/@dbpiper/slack-notify-status 'View this project on npm')
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

A module to send a slack message to a channel after a verification script is
finished running.

The basic idea is that you have a build and verification script, which may
run for a long time. So in order to avoid wasting time just staring at the build
script and waiting for it to finish, you can instead use this module and it
will send a message to your slack channel when it is finished.

You can configure slack to send you notifications on your computer or phone, and
now you've got an alert system for your build!

## Installation instructions

```sh
npm install @dbpiper/slack-notify-status
```

## Usage Instructions

```ts
(async () => {
  const slackNotifyStatus = new SlackNotifyStatus({
    slackUrl: 'hello',
    slackChannel: 'hello',
  });

  // do some work here

  const result = await slackNotifyStatus.slackSendMessage();
})();
```

## API

### new SlackNotifyStatus(options: SlackNotifyStatusOptions)

return type: `SlackNotifyStatus`

The instance object which is created to send the message, this has options
which configure various aspects of the process. The only absolutely required
ones are: the channel to post the message to and the slack url to use,
the webhook url.

In order to use this application you need to [setup your slack workspace to
receive incoming webhooks][slack-incoming-webhooks], which requires making an
application and giving it authorization to access your workspace.

### SlackNotifyStatusOptions

```ts
interface SlackNotifyStatusOptions {
  slackUrl: string;
  slackChannel: string;
  timer?: Timer; // defaults to @dbpiper/timer
  scriptName?: string; // defaults to 'Verification'
}
```

#### SlackNotifyStatusOptions.slackUrl

The slack webhooks url for your authorized application,
[see `new SlackNotifyStatus(options: SlackNotifyStatusOptions)` for more information](<#new-SlackNotifyStatus(options:-SlackNotifyStatusOptions)>).

#### SlackNotifyStatusOptions.slackChannel

The Slack channel that you'd like the messages to be posted to.

#### SlackNotifyStatusOptions.timer

The timer you want to use to measure how long the code took to run, by default
[@dbpiper/timer][@dbpiper/timer] is used. The API of the timer being used must
match the [@dbpiper/timer][@dbpiper/timer] API.

The timer will start measuring from the moment that the instance object is
created, thus it should not be created until measurement start is desired.

#### SlackNotifyStatusOptions.scriptName

The name of the script you are sending messages on behalf of, by default this
is 'Verification', as this is the name of my script.

---

### slackNotifyStatus.slackSendMessage(success = true, mock = false)

return type: `Promise<string | Error>`

This sends the message to slack. The success parameter indicates whether or
not the script the message is being sent on behalf of was successful or not.
In other words, if you are running a testing script and find an error in the
tests, you should send it with success as `false`.

Mock is useful in cases when you are debugging something and happen to be running
the script very frequently in these cases it can get quite annoying to get tons
of slack notifications every few minutes. So instead you can simply set mock
to `true` and no notifications will be sent. However, it should be noted that
any code reviews should ensure that slack is **not left** true!

If there are no problems sending the message, or if it is mocked, then the
Promise returned by slackSendMessage will be fulfilled with either a string,
which will either include the message which was sent if it was not mocked, or
a mocked message stating that it was a mock in this case.

If there _are_ problems sending the message, then the promise will be rejected
with an Error which is the error that prevented the sending of the message.

## License

[MIT](https://github.com/dbpiper/module-starter-kit/blob/master/LICENSE) Copyright
© [David Piper](https://github.com/dbpiper)

[slack-incoming-webhooks]: https://api.slack.com/incoming-webhooks
[@dbpiper/timer]: https://www.npmjs.com/package/@dbpiper/timer
