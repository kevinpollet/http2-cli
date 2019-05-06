/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import yargs from "yargs";
import http2 from "http2";
import { URL } from "url";

const { method, url } = yargs
  .scriptName("http2")
  .showHelpOnFail(true)
  .command("$0 <method> <url>", "default command", yargs =>
    yargs
      .positional("method", {
        choices: ["get"],
        description: "The HTTP method",
        type: "string",
      })
      .positional("url", {
        type: "string",
      })
  )
  .help()
  .version().argv;

const { origin, pathname } = new URL(url!);
const client = http2.connect(origin);

client
  .request({ ":method": method!.toUpperCase(), ":path": pathname })
  .on("response", headers => JSON.stringify(headers))
  .on("data", data => process.stdout.write(data));
