import fs from "fs";
import { homedir } from "os";
import process from "process";
import { SlackChannel } from "../types/SlackChannel";

const filePath = `${ homedir }/.alfred-slack.json`;

export type AlfredSlackJson = AlfredSlackJsonTeam[];

export interface AlfredSlackJsonTeam {
  team: string;
  teamId: string;
  channels: SlackChannel[]
}

export function modifyChannelsIn(alfredSlackJson: AlfredSlackJson, teamId: string, fct: (channels: SlackChannel[]) => SlackChannel[]) {
  return alfredSlackJson.map(team => {
    if (team.teamId === teamId) {
      return {...team, channels: fct(team.channels)};
    }
    return team;
  })
}

export function provideAlfredSlackJson(): AlfredSlackJson {

  if (!fs.existsSync(filePath)) {
    console.log(filePath + " does not exist")
    process.exit(1);
  }

  const content = fs.readFileSync(filePath).toString("utf-8");
  return JSON.parse(content);
}

export function writeAlfredSlackJson(content: AlfredSlackJson) {
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
}
