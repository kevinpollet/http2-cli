/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import chalk from "chalk";
import { httpHeadersToString } from "../src/httpHeadersToString";

describe("httpHeadersToString", () => {
  it("should a return a formatted string containing all headers", () => {
    const headers = {
      "one-header": "first",
      "second-header": "second",
      ":third": ["third", "third2"],
    };
    const headersString = httpHeadersToString(headers);

    expect(headersString).toEqual(
      chalk`{magenta One-Header}: first\n{magenta Second-Header}: second\n{magenta :third}: [third, third2]`
    );
  });
});
