/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */
import { readFileSync } from "fs";
import { resolve } from "path";

const packageJSONPath = resolve(__dirname, "..", "package.json");
const packageJSON = readFileSync(packageJSONPath).toString();

const { platform, arch, version: nodeVersion } = process;
const { name: packageName, version: packageVersion } = JSON.parse(packageJSON);

export const version = `${packageName}/${packageVersion} ${platform}-${arch} node-${nodeVersion}`;
