/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import chalk from "chalk";
import { IncomingHttpHeaders, OutgoingHttpHeaders } from "http2";

export const formatHttpHeaders = (
  headers: IncomingHttpHeaders | OutgoingHttpHeaders
): string =>
  Object.entries(headers)
    .map(([header, value]) => {
      const formattedHeader = header.replace(
        /[^-]+-?/g,
        m => `${m[0].toUpperCase()}${m.slice(1)}`
      );
      return `${chalk.magenta(formattedHeader)}: ${value}`;
    })
    .join("\n");
