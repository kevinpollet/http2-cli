/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import yargs from "yargs";
import jsonColorizer from "json-colorizer";
import { URL } from "url";
import pump from "pump";
import { formatHttpHeaders } from "./formatHttpHeaders";
import { emptyReadable } from "./emptyReadable";
import { AuthenticationType } from "./AuthenticationType";
import { version } from "./version";
import { HttpMethod } from "./HttpMethod";
import { makeRequest } from "./makeRequest";

const { method, url, verbose, auth, "auth-type": authType, insecure } = yargs
  .help()
  .strict(true)
  .version(version)
  .wrap(null)
  .option("auth", {
    description: "The authentication credentials",
    requiresArg: true,
    string: true,
  })
  .option("auth-type", {
    choices: Object.keys(AuthenticationType),
    coerce: arg => arg as AuthenticationType,
    default: AuthenticationType.Basic,
    description: "The authentication type",
    requiresArg: true,
  })
  .option("insecure", {
    description: "Disable the server certificate verification",
    boolean: true,
  })
  .option("verbose", {
    description: "Display the HTTP response headers",
    boolean: true,
  })
  .command("$0 <method> <url>", "", yargs =>
    yargs
      .positional("method", {
        choices: Object.keys(HttpMethod) as HttpMethod[],
        coerce: (arg: string) => arg.toUpperCase() as HttpMethod,
        description: "The HTTP method",
      })
      .positional("url", {
        coerce: (arg: string) => {
          const parsedURL = new URL(arg);
          if (
            parsedURL.protocol === "https:" ||
            parsedURL.protocol === "http:"
          ) {
            return parsedURL;
          }
          throw new TypeError("Unsupported URL format");
        },
        description: "The HTTP URL to request",
      })
      .demandOption(["method", "url"])
  ).argv;

const inputStream = process.stdin.isTTY ? emptyReadable : process.stdin;

makeRequest({
  method,
  url,
  inputStream,
  options: {
    rejectUnauthorized: !!insecure,
    auth: { type: authType, credentials: auth || "" },
  },
})
  .then(({ headers, stream }) => {
    const statusCode = parseInt(headers[":status"] as string);
    const outputStream = statusCode >= 400 ? process.stderr : process.stdout;

    if (verbose) {
      process.stdout.write(`${formatHttpHeaders(headers)}\n\n`);
    }

    if (outputStream.isTTY && headers["content-type"] === "application/json") {
      const buffers: Buffer[] = [];
      stream.on("data", buffers.push.bind(buffers)).on("end", () => {
        outputStream.write(jsonColorizer(Buffer.concat(buffers).toString()));
        process.exit();
      });
    } else {
      pump(stream, outputStream);
    }
  })
  .catch((err: Error) => {
    process.exit(1);
    process.stderr.write(err.message);
  });
