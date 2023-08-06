#!/usr/bin/env node

const prepareCommitMessage = require('../lib/');

prepareCommitMessage(process.argv[2], process.argv[3]);
