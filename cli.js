#!/usr/bin/env node

'use strict';

const path = require('path');
const meow = require('meow');
const unenvify = require('unenvify');
const untildify = require('untildify');
const symlinks = require('@moonandyou/symlinks');

const cli = meow(`
	Usage
	  $ sn [path ...dest]

	Options
		--hidden Create a link as a dotfile [Default: false]
	  --no-ext Strip extension string in filename [Default: false]
	  --overwrite Overwrite exist symbolic link or not [Default: false]

	Examples
	  $ sn **/*.symlink "$HOME/Google Drive/dotfiles" $HOME
`);

if (cli.input.length < 2) {
	console.error('Invalid arguments, we need more arguments');
	process.exit(-1);
}

const dest = cli.input.pop();
const patterns = cli.input.map(p => unenvify(untildify(p)));
let filter;

if (cli.flags.hidden || cli.flags.ext === false) {
	filter = f => `${cli.flags.hidden ? '.' : ''}${cli.flags.ext ? f : path.basename(f, path.extname(f))}`;
}

symlinks(patterns, dest, filter, cli.flags).then(links => {
	links.map(link => console.log(`Create a link to ${link}`));
});
