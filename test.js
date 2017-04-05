import fs from 'fs';
import path from 'path';
import test from 'ava';
import osRandTmpDir from 'os-random-tmpdir';
import mkdirp from 'mkdirp';
import execa from 'execa';

async function createSymlinks(patterns, opts, assert) {
	const dest = osRandTmpDir('symlinks-cli');
	mkdirp.sync(dest);

	await execa('./cli.js', patterns.concat(dest, opts));

	return new Promise((resolve, reject) => {
		fs.readdir(dest, (err, files) => {
			if (err || files.length === 0) {
				reject();
			}

			files.forEach(f => {
				assert(dest, f);
			});

			resolve();
		});
	});
}

test('Creat Symlinks', async t => {
	await createSymlinks(['*.js', 'readme.md'], [], (dest, f) => {
		t.true(fs.lstatSync(path.join(dest, f)).isSymbolicLink());
	});
});

test('Creat Symlinks with dot', async t => {
	await createSymlinks(['*.js', 'readme.md'], ['--hidden'], (dest, f) => {
		t.true(f.indexOf('.') === 0);
	});
});

test('Creat Symlinks without ext', async t => {
	await createSymlinks(['*.js', 'readme.md'], ['--no-ext'], (dest, f) => {
		t.true(f.indexOf('.') === -1);
	});
});
