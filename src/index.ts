/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import yargs from "yargs";
import http2 from "http2";
import { URL } from "url";
import pump from "pump";
import { formatHttpHeaders } from "./formatHttpHeaders";
import { toOutgoingHeaders } from "./toOutgoingHeaders";
import { emptyReadable } from "./emptyReadable";
import { isErrorStatusCode } from "./isErrorStatusCode";
import { AuthenticationType } from "./AuthenticationType";
import { version } from "./version";
import { HttpMethod } from "./HttpMethod";

const {
  method,
  url: { origin, pathname, search },
  verbose,
  auth,
  "auth-type": authType,
  insecure,
} = yargs
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
            parsedURL.protocol === "https"
          ) {
            return parsedURL;
          }
          throw new TypeError("Unsupported URL format");
        },
        description: "The HTTP URL to request",
      })
      .demandOption(["method", "url"])
  ).argv;

http2.connect(origin, { rejectUnauthorized: !!insecure }, session => {
  const stdinStream = process.stdin.isTTY ? emptyReadable : process.stdin;
  const http2Stream = session.request(
    toOutgoingHeaders({
      auth: auth ? { type: authType, credentials: auth } : undefined,
      method,
      path: `${pathname}${search}`,
    })
  );

  http2Stream
    .on("end", () => session.destroy())
    .on("response", headers => {
      const statusCode = parseInt(headers[":status"] as string);
      const isError = isErrorStatusCode(statusCode);
      const outputStream = isErrorStatusCode ? process.stderr : process.stdout;

      if (verbose) {
        process.stdout.write(formatHttpHeaders(headers));
      }

      if (isError) {
        session.destroy();
        process.exit(1);
      }

      pump(http2Stream, outputStream);
    });

  pump(stdinStream, http2Stream);
});
