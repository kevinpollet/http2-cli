/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import chalk from "chalk";
import { HttpHeaders } from "./HttpHeaders";
import { isArray } from "util";

export const httpHeadersToString = (headers: HttpHeaders): string =>
  Object.entries(headers)
    .map(([header, value]) => {
      const valueString =
        value && isArray(value) ? `[${value.join(", ")}]` : `${value}`;
      const headerString = header.replace(
        /[^-]+-?/g,
        m => `${m[0].toUpperCase()}${m.slice(1).toLowerCase()}`
      );

      return chalk`{magenta ${headerString}}: ${valueString}`;
    })
    .join("\n");
