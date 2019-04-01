# slack-notify-status

A module to send a slack message to a channel after a verification script is
finished running.

## API

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
    <td>[success]</td><td><code>boolean</code></td><td><code>true</code></td><td></td>
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

