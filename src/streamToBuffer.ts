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
    .on("end", () => eventEmitter.emit("end", Buffer.concat(buffers)))
    .on("data", (data: string | Buffer) => buffers.push(Buffer.from(data)));

  return eventEmitter;
};
