/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import jsonColorizer from "json-colorizer";

export const colorizeJSON = (json: string): string =>
  jsonColorizer(json, { colors: { STRING_KEY: "blue" } });
