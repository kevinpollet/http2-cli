/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { version } from "../src/version";

describe("version", () => {
  const { platform, arch, version: nodeVersion } = process;
  const { name: packageName, version: packageVersion } = JSON.parse(
    readFileSync(resolve(__dirname, "..", "package.json")).toString()
  );

  it("should return a string matching", () => {
    expect(version).toBe(
      `${packageName}/${packageVersion} ${platform}-${arch} node-${nodeVersion}`
    );
  });
});
