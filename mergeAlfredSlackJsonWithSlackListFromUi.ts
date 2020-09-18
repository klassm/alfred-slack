import { config } from "dotenv";
import {homedir} from "os"
import fs from "fs";
import process from "process";
import {groupBy, mapValues, sortedUniqBy} from "lodash";

const listResponse = {"next_marker":"","results":[],"ok":true}


interface HasIdAndName {
  name: string;
  id: string;
}

config();

const filePath = `${homedir}/.alfred-slack.json`;
if (!fs.existsSync(filePath)) {
  console.log(filePath + " does not exist")
  process.exit(1);
}

const json = JSON.parse(fs.readFileSync(filePath).toString());

const groupedByTeams = groupBy(listResponse.results, (result: any) => result.team_id);
const mappedTeams = mapValues(groupedByTeams, users => users.map((user: any) => ({
    name: "@" + user.real_name,
    id: user.id
  }))
)

function mergeChannels(teamChannels: HasIdAndName[], newChannels: HasIdAndName[]): HasIdAndName[] {
  const channels = [...teamChannels, ...newChannels];
  return sortedUniqBy(channels, channel => channel.id);
}

const result = json.map((team: any) => ({
  ...team,
  channels: mergeChannels(team.channels, mappedTeams[team.teamId] || [])
}))


console.log(JSON.stringify(result));
