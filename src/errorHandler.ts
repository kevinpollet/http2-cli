/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

export const errorHandler = (err: Error): void => {
  process.stderr.write(`Error: ${err.message}\n`);
  process.exit(1);
};
