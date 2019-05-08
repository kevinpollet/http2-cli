/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

declare module "json-colorizer" {
  type Token =
    | "BRACE"
    | "BRACKET"
    | "COLON"
    | "COMMA"
    | "STRING_KEY"
    | "STRING_LITERAL"
    | "NUMBER_LITERAL"
    | "BOOLEAN_LITERAL"
    | "NULL_LITERAL";

  interface Options {
    readonly pretty?: boolean;
    readonly colors?: { [key in Token]?: string };
  }

  export default function colorize(json: string, options?: Options): string;
}
