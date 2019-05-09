/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import jsonColorizer from "json-colorizer";
import yargs from "yargs";
import { URL } from "url";
import { httpHeadersToString } from "./httpHeadersToString";
import { AuthenticationType } from "./AuthenticationType";
import { version } from "./version";
import { HttpMethod } from "./HttpMethod";
import { makeRequest } from "./makeRequest";
import { isHttpURL } from "./isHttpURL";
import { streamToBuffer } from "./streamToBuffer";
import { getStdin } from "./getStdin";
import { errorHandler } from "./errorHandler";

const {
  method,
  url,
  verbose,
  auth: authCredentials,
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
        coerce: (url: string) => {
          if (!isHttpURL(url)) {
            throw new Error("Unsupported URL format");
          }
          return new URL(url);
        },
        description: "The HTTP URL to request",
      })
      .demandOption(["method", "url"])
  ).argv;

getStdin()
  .pipe(
    makeRequest(method, url, {
      rejectUnauthorized: !!insecure,
      auth:
        authCredentials && authType
          ? { type: authType, credentials: authCredentials }
          : undefined,
    })
  )
  .on("response", function(this: NodeJS.ReadableStream, headers) {
    const statusCode = parseInt(headers[":status"] as string);
    const outputStream = statusCode >= 400 ? process.stderr : process.stdout;

    if (verbose) {
      process.stderr.write(`${httpHeadersToString(headers)}\n\n`);
    }

    if (outputStream.isTTY && headers["content-type"] === "application/json") {
      streamToBuffer(this)
        .on("error", errorHandler)
        .on("end", buffer => {
          const options = { colors: { STRING_KEY: "blue" } };
          outputStream.write(jsonColorizer(buffer.toString(), options));
        });
    } else {
      this.pipe(outputStream);
    }
  })
  .on("error", errorHandler);
