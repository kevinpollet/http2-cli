#!/usr/bin/env node

const execa = require("execa");
const { parse } = require("semver");

const dockerId = "kevinpollet";
const { version, major, minor } = parse(process.env.npm_package_version);
const dockerTags = ["latest", `${major}`, `${major}.${minor}`, `${version}`];

const subprocesses = dockerTags.map(tagName =>
  execa("docker", [
    "push",
    `${dockerId}/${process.env.npm_package_name}:${tagName}`,
  ])
);

Promise.all(subprocesses).catch(err => {
  process.stderr.write(`${err.message}\n`);
  process.exit(err.exitCode);
});
