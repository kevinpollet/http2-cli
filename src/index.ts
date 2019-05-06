/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import yargs from "yargs";
import http2, { OutgoingHttpHeaders } from "http2";
import { URL } from "url";
import { printHeaders } from "./printHeaders";

const { method, url, verbose, auth } = yargs
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
        verbose: {
          type: "boolean",
        },
        auth: {
          type: "string",
        },
      })
  )
  .help()
  .version().argv;

const { origin, pathname } = new URL(url as string);
const client = http2.connect(origin);
const requestOptions: OutgoingHttpHeaders = {
  ":method": (method as string).toUpperCase(),
  ":path": pathname,
};

if (auth) {
  requestOptions["Authorization"] = `Basic ${Buffer.from(auth).toString(
    "base64"
  )}`;
}

client
  .request(requestOptions)
  .on("response", headers => (verbose ? printHeaders(headers) : undefined))
  .on("data", data => process.stdout.write(data))
  .on("end", () => (client as any).close()); // eslint-disable-line
