/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import yargs from "yargs";
import http2 from "http2";
import { URL } from "url";
import { printHeaders } from "./printHeaders";
import { getOutgoingHeaders } from "./getOutgoingHeaders";

const { method, url, verbose, auth, authType, insecure } = yargs
  .scriptName("http2")
  .showHelpOnFail(true)
  .command("$0 [method] <url>", "default command", yargs =>
    yargs
      .positional("method", {
        choices: ["get"],
        default: "get",
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

http2.connect(origin, { rejectUnauthorized: !!insecure }, session =>
  session
    .request(
      getOutgoingHeaders({
        auth: auth ? { type: authType, credentials: auth } : undefined,
        method,
        path,
      })
    )
    .on("response", headers => (verbose ? printHeaders(headers) : undefined))
    .on("data", data => process.stdout.write(data))
    .on("end", () => session.destroy())
);
