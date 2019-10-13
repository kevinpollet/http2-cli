/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import { errorHandler } from "../src/errorHandler";

describe("errorHandler", () => {
  it("should print the given Error message to stderr and call exit with a positive number", () => {
    const writeFn = jest.fn();
    const exitFn = jest.fn<never, unknown[]>();

    process.stderr.write = writeFn; // eslint-disable-line @typescript-eslint/unbound-method
    process.exit = exitFn; // eslint-disable-line @typescript-eslint/unbound-method

    errorHandler(new Error("message"));

    expect(writeFn).toHaveBeenCalledTimes(1);
    expect(writeFn).toHaveBeenCalledWith(`Error: message\n`);
    expect(exitFn).toHaveBeenCalledTimes(1);
    expect(exitFn).toHaveBeenCalledWith(1);
  });
});
