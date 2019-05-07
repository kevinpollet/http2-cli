/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

declare module "pump" {
  export default function pump(
    readable: NodeJS.ReadableStream,
    writable: NodeJS.WritableStream
  ): NodeJS.WritableStream;
}
