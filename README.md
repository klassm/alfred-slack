Alfred Slack
=======

Workflow to open Slack channels and contacts without having to obtain an OAuth token.

The plugin uses [Slack Deep Linking](https://api.slack.com/reference/deep-linking#open_a_channel). 

### Installation
1. Download the Workflow ([alfred_slack.alfredworkflow](alfred_slack.alfredworkflow))
2. Double click to install
3. Create a `.alfred-slack.json` in your user home directory.

### Content of .alfred-slack.json

```
[
  {
    "team": "myTeam",
    "teamId": "ABCDEFG",
    "channels": [
      {
        "name": "#some-channel",
        "id": "ABCDEFGH"
      },
      {
        "name": "@some-user",
        "id": "DEFGHIJK"
      }
    ]
  }
]
```

A `name` only refers to some viewable text. For displaying, only
the IDs are relevant. You can obtain them by opening up the Slack web client
and then switching through channels and users. Note how the URL changed. The static
ID part is the teamId, the variable one is the channel id.


