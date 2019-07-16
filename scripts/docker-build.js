#!/usr/bin/env node

const execa = require("execa");
const { join } = require("path");
const { parse } = require("semver");

const dockerId = "kevinpollet";
const { version, major, minor } = parse(process.env.npm_package_version);
const dockerTags = ["latest", `${major}`, `${major}.${minor}`, `${version}`];

const subprocess = execa("docker", [
  "build",
  join(__dirname, ".."),
  ...[].concat(
    ...dockerTags.map(tagName => [
      "-t",
      `${dockerId}/${process.env.npm_package_name}:${tagName}`,
    ])
  ),
]);

subprocess.stdout.pipe(process.stdout);

subprocess.catch(err => {
  process.stderr.write(`${err.message}\n`);
  process.exit(err.exitCode);
});
