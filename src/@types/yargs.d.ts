/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import { Arguments } from "yargs";

declare module "yargs" {
  interface Argv<T = {}> {
    command<U>(
      command: string,
      description: string,
      builder?: (args: Argv<T>) => Argv<U>,
      handler?: (args: Arguments<U>) => void
    ): Argv<U>;
  }
}
