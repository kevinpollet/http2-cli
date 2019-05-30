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
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => {
      const formattedValue =
        value && isArray(value) ? `[${value.join(", ")}]` : `${value}`;
      const formattedKey = key.replace(
        /[^-]+-?/g,
        m => `${m[0].toUpperCase()}${m.slice(1).toLowerCase()}`
      );

      return chalk`{magenta ${formattedKey}}: ${formattedValue}`;
    })
    .join("\n");
