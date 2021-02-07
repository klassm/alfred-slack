#!/usr/bin/env node

/**
 * Script to update your .alfred-slack.json with data from the content of the Slack webpage.
 * To use this script open up your slack team in the webbrowser and copy out the HTML content of the page.
 * Paste the content in a slack.html in the top level directory of this project.
 *
 * Afterwards run this script.
 */

import { readFileSync, existsSync } from "fs";
import { parse } from 'node-html-parser';
import { homedir } from "os";
import { mergeChannels } from "./types/SlackChannel";
import { modifyChannelsIn, provideAlfredSlackJson, writeAlfredSlackJson } from "./utils/alfredSlackJson";

const filePath = `${ homedir }/.alfred-slack.json`;
if (!existsSync(filePath)) {
  console.log(filePath + " does not exist")
  process.exit(1);
}

const alfredSlackJson = provideAlfredSlackJson();

const linkRegex = new RegExp("https://[^.]+.slack.com/archives/([\\d\\w]+)$");
const teamIdRegex = new RegExp("https://ca.slack-edge.com/([^-]+)-.*");

const html = readFileSync("slack.html").toString("utf-8");
const root = parse(html, undefined);

const teamIdImageLink = root.querySelectorAll("img")
  .find(img => teamIdRegex.test(img.getAttribute("src") ?? ""))
  ?.getAttribute("src")
if (!teamIdImageLink) {
  throw new Error("cannot find team");
}
const teamId = teamIdImageLink.match(teamIdRegex)![1];

const channelsAndUsers = root.querySelectorAll("a")
  .filter(link => link.hasAttribute("href"))
  .map(link => ( {
    href: link.getAttribute("href")!,
    text: link.innerText,
    isChannel: link.getAttribute("data-qa-channel-sidebar-channel-type") === "channel"
  } ))
  .filter(link => linkRegex.test(link.href))
  .map(({ href, text, isChannel }) => {
    const id = href.match(linkRegex)![1];
    const prefix = isChannel ? "#" : "@";
    return ( {
      name: `${ prefix }${ text }`,
      id,
      teamId
    } );
  });

const newAlfredSlackJson = modifyChannelsIn(alfredSlackJson, teamId, (channels) => mergeChannels(channels, channelsAndUsers))
console.log(JSON.stringify(newAlfredSlackJson, null, 2));
writeAlfredSlackJson(newAlfredSlackJson);
