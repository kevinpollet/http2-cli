/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

export const streamToBuffer = (
  readable: NodeJS.ReadableStream,
  callback: ({ err, buffer }: { err?: Error; buffer?: Buffer }) => void
): void => {
  const buffers: Buffer[] = [];

  readable
    .once("error", err => callback({ err }))
    .once("end", () => callback({ buffer: Buffer.concat(buffers) }))
    .on("data", (data: string | Buffer) =>
      typeof data === "string"
        ? buffers.push(Buffer.from(data))
        : buffers.push(data)
    );
};
