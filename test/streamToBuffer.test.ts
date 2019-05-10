/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import { Readable } from "stream";
import { streamToBuffer } from "../src/streamToBuffer";

describe("streamToBuffer", () => {
  it("should emit an end event with the corresponding Buffer", done => {
    const data = "dummy";
    const readable = new Readable({
      read() {
        this.push(Buffer.from(data));
        this.push(null);
      },
    });

    streamToBuffer(readable).on("end", (buffer: Buffer) => {
      expect(buffer.toString()).toBe(data);
      done();
    });
  });

  it("should emit an error event with the corresponding error", done => {
    const error = new Error("dummy");
    const readable = new Readable({
      read() {
        this.emit("error", error);
      },
    });

    streamToBuffer(readable).on("error", (error: Error) => {
      expect(error).toBe(error);
      done();
    });
  });
});
