#!/usr/local/bin/node
// deep link tutorial https://api.slack.com/reference/deep-linking#open_a_channel

const fs = require("fs");
const process = require("process");
const homedir = require('os').homedir();

const filePath = `${homedir}/.alfred-slack.json`;
if (!fs.existsSync(filePath)) {
    console.log(filePath + " does not exist")
    process.exit(1);
}

const json = JSON.parse(fs.readFileSync(filePath));

function toAlfred(teamId, team, channel) {
    const match = `${teamId} ${channel.name} ${channel.name.replace(/[#@]/, "")} ` + channel.name.replace(/[#@]/, "").split(/[- ]/).join(" ");
    return {
        uid: `${teamId}-${channel.id}`,
        title: channel.name,
        subtitle: team,
        arg: `slack://channel?team=${teamId}&id=${channel.id}`,
        match,
        autocomplete: match
    }
}

const teams = json.map(account => toAlfred(account.teamId, account.team, {name: "Team " + account.team, id: ""}))

const channels = json.flatMap(
    account => account.channels.map(channel => toAlfred(account.teamId, account.team, channel))
)

console.log(JSON.stringify({items: [...channels, ...teams]}))
