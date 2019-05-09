/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import { isHttpURL } from "../src/isHttpURL";

describe("isHttpURL", () => {
  it("should return true if it's an HTTP URL", () =>
    expect(isHttpURL("http://dummy.com")).toBeTruthy());

  it("should return true if it's an HTTPS URL", () =>
    expect(isHttpURL("https://dummy.com")).toBeTruthy());

  it("should return false if it's not an HTTP or HTTPS URL", () =>
    expect(isHttpURL("file://dummy")).toBeFalsy());
});
