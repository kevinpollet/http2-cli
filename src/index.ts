/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import yargs from "yargs";
import http2 from "http2";
import { URL } from "url";
import { formatHttpHeaders } from "./formatHttpHeaders";
import { toOutgoingHeaders } from "./toOutgoingHeaders";
import { emptyReadable } from "./emptyReadable";

const { method, url, verbose, auth, authType, insecure } = yargs
  .scriptName("http2")
  .showHelpOnFail(true)
  .command("$0 <method> <url>", "default command", yargs =>
    yargs
      .positional("method", {
        choices: ["delete", "get", "head", "options", "post", "put", "path"],
        type: "string",
      })
      .positional("url", {
        type: "string",
      })
      .options({
        auth: {
          type: "string",
        },
        authType: {
          choices: ["basic", "bearer"],
          default: "basic",
          type: "string",
        },
        insecure: {
          type: "boolean",
        },
        verbose: {
          type: "boolean",
        },
      })
  )
  .help()
  .version().argv;

const { origin, pathname: path } = new URL(url as string);

http2.connect(origin, { rejectUnauthorized: !!insecure }, session => {
  const stdinStream = process.stdin.isTTY ? emptyReadable : process.stdin;
  const http2Stream = session.request(
    toOutgoingHeaders({
      auth: auth ? { type: authType, credentials: auth } : undefined,
      method: method as string,
      path,
    })
  );

  http2Stream
    .on("end", () => session.destroy())
    .on("response", headers => {
      if (verbose) {
        process.stdout.write(formatHttpHeaders(headers));
      }
    })
    .pipe(process.stdout);

  stdinStream.pipe(http2Stream);
});
