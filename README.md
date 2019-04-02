# slack-notify-status

A module to send a slack message to a channel after a verification script is
finished running.

## API


* [SlackNotifyStatus](#SlackNotifyStatus)
    * _instance_
        * [.slackSendMessage([success], [mock])](#SlackNotifyStatus+slackSendMessage)
    * _static_
        * [.exports.SlackNotifyStatus](#SlackNotifyStatus.exports.SlackNotifyStatus)
            * [new exports.SlackNotifyStatus(options)](#new_SlackNotifyStatus.exports.SlackNotifyStatus_new)
        * [.getElapsedTime()](#SlackNotifyStatus.getElapsedTime) ⇒
        * [.getSlackMessageStrict()](#SlackNotifyStatus.getSlackMessageStrict) ⇒
        * [.getSlackMessageLazy()](#SlackNotifyStatus.getSlackMessageLazy) ⇒

<a name="SlackNotifyStatus+slackSendMessage"></a>

### slackNotifyStatus.slackSendMessage([success], [mock])
**Kind**: instance method of [<code>SlackNotifyStatus</code>](#SlackNotifyStatus)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[success]</td><td><code>boolean</code></td><td><code>true</code></td><td><p>Indicates whether or not to send slack the
success message, if it is not Truthy then then the failure message will
be send to slack instead.</p>
</td>
    </tr><tr>
    <td>[mock]</td><td><code>boolean</code></td><td><code>false</code></td><td><p>Indicates whether or not the method actually
sends a real message to slack. This is disabled by default, since the whole
point of the module is to send slack messages, however if you are using
this module as part of a verify script then it may be annoying during
debugging to get tons of slack messages all day. In this case, you may want
to turn it off until you have finished debugging.</p>
</td>
    </tr>  </tbody>
</table>

<a name="SlackNotifyStatus.exports.SlackNotifyStatus"></a>

### SlackNotifyStatus.exports.SlackNotifyStatus
**Kind**: static class of [<code>SlackNotifyStatus</code>](#SlackNotifyStatus)  
<a name="new_SlackNotifyStatus.exports.SlackNotifyStatus_new"></a>

#### new exports.SlackNotifyStatus(options)
Creates an instance of SlackNotifyStatus.

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>SlackNotifyStatusOptions</code></td><td><p>The options to use to configure
SlackNotifyStatus, basically these are used to setup the slack endpoint
and messaging options.</p>
</td>
    </tr>  </tbody>
</table>

<a name="SlackNotifyStatus.getElapsedTime"></a>

### SlackNotifyStatus.getElapsedTime() ⇒
Gets the amount of time that has elapsed since the
`slackNotifyStatus.startTimer` function was called. In other words,
how long a task has taken to complete.

**Kind**: static method of [<code>SlackNotifyStatus</code>](#SlackNotifyStatus)  
**Returns**: The elapsed time in milliseconds.  
<a name="SlackNotifyStatus.getSlackMessageStrict"></a>

### SlackNotifyStatus.getSlackMessageStrict() ⇒
Gets the slack message which will be sent after applying all of the
options which were used to initialize and configure the
SlackNotifyStatus instance object.

Strict version, which means that it will evaluate the Message. Meaning,
that if it is of type GetMessageFunction instead of string, then the
GetMessageFunction function will be called. Thus, evaluating the
GetMessageFunction to a raw string.

**Kind**: static method of [<code>SlackNotifyStatus</code>](#SlackNotifyStatus)  
**Returns**: The slack message which will be sent.  
<a name="SlackNotifyStatus.getSlackMessageLazy"></a>

### SlackNotifyStatus.getSlackMessageLazy() ⇒
Gets the slack message which will be sent after applying all of the
options which were used to initialize and configure the
SlackNotifyStatus instance object.

Lazy version, which means that it **won't** evaluate the Message
if it is a GetMessageFunction instead of a string.

**Kind**: static method of [<code>SlackNotifyStatus</code>](#SlackNotifyStatus)  
**Returns**: The slack message which will be sent.  
