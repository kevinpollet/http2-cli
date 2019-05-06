/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import { OutgoingHttpHeaders } from "http2";

export const printHeaders = (headers: OutgoingHttpHeaders): void =>
  Object.entries(headers).forEach(([header, value]) =>
    process.stdout.write(`${header}: ${value}\n`)
  );
