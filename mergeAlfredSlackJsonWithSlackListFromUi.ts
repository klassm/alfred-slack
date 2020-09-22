import { config } from "dotenv";
import fs from "fs";
import { groupBy, uniqBy } from "lodash";
import { homedir } from "os"
import process from "process";

// Obtain it from https://api.slack.com/methods/users.list/test and from https://api.slack.com/methods/conversations.list/test
// You can retrieve a token from a list request in the normal Slack web UI. Just steal a token from some request.
// Make sure to still be logged in to Slack when you test the API methods - this only works while you
// are still logged in to Slack.
const listResponse = {} as any

interface HasIdAndName {
  name: string;
  id: string;
}
interface HasIdAndNameAndTeam extends HasIdAndName {
  teamId: string;
}

config();

const filePath = `${homedir}/.alfred-slack.json`;
if (!fs.existsSync(filePath)) {
  console.log(filePath + " does not exist")
  process.exit(1);
}

const json = JSON.parse(fs.readFileSync(filePath).toString());

function getValuesToMap(response: any): HasIdAndNameAndTeam[] {
  if (response.channels) {
    return response.channels.map((channel: any) => ({
      name: "#" + channel.name,
      id: channel.id,
      teamId: channel.shared_team_ids && channel.shared_team_ids[0]
    }))
  }

  if (response.members) {
    return response.members.map((user: any) => ({
      name: "@" + user.real_name,
      id: user.id,
      teamId: user.team_id
    }))
  }

  throw new Error("Don't know how to handle this response");
}

function mergeChannels(teamChannels: HasIdAndName[], newChannels: HasIdAndName[]): HasIdAndName[] {
  const channels = [...teamChannels, ...newChannels];
  return uniqBy(channels, channel => channel.id);
}

const groupedByTeams = groupBy(getValuesToMap(listResponse), (result: any) => result.teamId);

const result = json.map((team: any) => ({
  ...team,
  channels: mergeChannels(team.channels, groupedByTeams[team.teamId] || [])
}))

console.log(JSON.stringify(result));
