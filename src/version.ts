/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */
import fs from "fs";
import { resolve } from "path";

const packageJSON = resolve(__dirname, "..", "package.json");
const { name, version: packageVersion } = JSON.parse(
  fs.readFileSync(packageJSON).toString()
);

export const version = `${name}/${packageVersion} ${process.platform}-${
  process.arch
} node-${process.version}`;
