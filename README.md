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

