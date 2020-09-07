#!/usr/local/bin/node

const { exec } = require('child_process');
const process = require("process");

const command = `open '${process.argv[2]}'`;
console.log(command);
exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
});
