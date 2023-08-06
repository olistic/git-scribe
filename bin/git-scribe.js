#!/usr/bin/env node

import { prepareCommitMessage } from '../lib/index.js';

prepareCommitMessage(process.argv[2], process.argv[3]);
