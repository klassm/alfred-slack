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

# Updating the content of .alfred-slack.json

As soon you have created an initial `.alfred-slack.json`, updating becomes quite
cumbersome. To ease the process there are two utility scripts to help you update the content.

## Via a Slack App

This approach will update your `.alfred-slack.json` using all channels and users
in your workspace. Problem about this is that you need an installed Slack app
with `channels.read` and `users.read` permissions. A normal user does not have those permissions.

But in case you do - follow this approach for both updating channels and users.

* You need to get the actual available via the Slack API tester ([users](https://api.slack.com/methods/users.list/test) and [channels](https://api.slack.com/methods/conversations.list/test)). Execute the respective query and copy the content (for each separate) to a top level`list-response.json`.
* Run `npm run mergeAlfredSlackJsonWithSlackListFromApiTester` to get it merged to your `.alfred-slack.json`.

## Via HTML content

This is the more generic approach. However, it will only put users and channels to your `.alfred-slack.json` that is actually visible on the page. In case you want a specific users, make sure it is visible on the web page.

Afterwards, open up your Slack workspace in the browser and copy the HTML source code to a top level `slack.html`.

Then run `npm run mergeAlfredSlackJsonChannelInfoFromHtml` to get it merged to your `.alfred-slack.json`.



