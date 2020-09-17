import { config } from "dotenv";
import process from "process";
import axios from "axios";

config();

interface HasIdAndName {
  name: string;
  id: string;
}
type SlackChannel = HasIdAndName
type SlackTeam = HasIdAndName
type SlackUser = HasIdAndName

interface SearchableTeam {
  team: string;
  teamId: string;
  channels: HasIdAndName[]
}


async function fetchTeam(token: string): Promise<SlackTeam> {
  const response = await axios.get(`https://slack.com/api/team.info?token=${token}&pretty=1`)
  return response.data.team;
}

async function fetchUsers(token: string): Promise<SlackUser[]> {
  const response = await axios.get(`https://slack.com/api/users.list?token=${token}&limit=100000&pretty=1`)
  return response.data.members
    .filter(({deleted, is_bot}: any) => !deleted && !is_bot)
    .map(({id, real_name, name}: any) => ({id: id, name: "@" + (real_name ?? name)}));
}

async function fetchChannels(token: string): Promise<SlackChannel[]> {
  const response = await axios.get(`https://slack.com/api/users.conversations?token=${token}&limit=100000&pretty=1&types=public_channel,private_channel`)
  return response.data.channels.map(({id, name}: any) => ({id, name: `#${name}`}));
}

async function generateConfigFor(token: string): Promise<SearchableTeam> {
  const channels = await fetchChannels(token);
  const team = await fetchTeam(token);
  const users = await fetchUsers(token);

  return {
    team: team.name,
    teamId: team.id,
    channels: [...channels, ...users].map(({id, name}) => ({id, name}))
  }
}

async function generateConfig() {
  const slackTokens = (process.env.TOKENS ?? "").split(",").filter(it => it);

  const result = await Promise.all(slackTokens.map(token => generateConfigFor(token)));

  console.log(JSON.stringify(result))
}

generateConfig();

