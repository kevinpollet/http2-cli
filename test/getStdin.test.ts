/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import { getStdin } from "../src/getStdin";
import { Readable } from "stream";

describe("getStdin", () => {
  it("should return stdin if process is not run with a TTY", () => {
    process.stdin.isTTY = undefined;

    expect(getStdin()).toBe(process.stdin);
  });

  it("should return an empty Readable if process is run with a TTY", () => {
    process.stdin.isTTY = true;

    const readable = getStdin();

    expect(readable).toBeInstanceOf(Readable);
    expect(readable.read()).toBeNull();
  });
});
