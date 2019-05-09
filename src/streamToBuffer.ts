/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */
import { EventEmitter } from "events";

export const streamToBuffer = (
  readable: NodeJS.ReadableStream
): EventEmitter => {
  const buffers: Buffer[] = [];
  const eventEmitter = new EventEmitter();

  readable
    .on("error", err => eventEmitter.emit("error", err))
    .on("end", function(this: NodeJS.ReadableStream) {
      eventEmitter.emit("end", Buffer.concat(buffers));
    })
    .on("data", (data: string | Buffer) =>
      typeof data === "string"
        ? buffers.push(Buffer.from(data))
        : buffers.push(data)
    );

  return eventEmitter;
};
