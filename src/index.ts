/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import yargs from "yargs";
import { URL } from "url";
import { httpHeadersToString } from "./httpHeadersToString";
import { AuthenticationType } from "./AuthenticationType";
import { version } from "./version";
import { HTTPMethod } from "./HTTPMethod";
import { request } from "./request";
import { streamToBuffer } from "./streamToBuffer";
import { getStdin } from "./getStdin";
import { errorHandler } from "./errorHandler";
import { HTTPHeaders } from "./HTTPHeaders";
import { colorizeJSON } from "./colorizeJSON";

const {
  auth: authCredentials,
  "auth-type": authType,
  insecure,
  headers,
  method,
  url,
  verbose,
} = yargs
  .help()
  .strict(true)
  .version(version)
  .wrap(null)
  .option("auth", {
    description: "Specify the authentication credentials",
    requiresArg: true,
    string: true,
  })
  .option("auth-type", {
    choices: Object.keys(AuthenticationType),
    coerce: (arg: string) => {
      const normalizedArg = arg[0].toUpperCase() + arg.slice(1).toLowerCase();
      return normalizedArg as AuthenticationType;
    },
    default: AuthenticationType.Basic,
    description: "Specify the authentication mechanism",
    requiresArg: true,
  })
  .option("insecure", {
    description: "Disable the host SSL/TLS certificate verification",
    boolean: true,
  })
  .option("verbose", {
    description: "Display the HTTP response headers",
    boolean: true,
  })
  .command("$0 <method> <url> [headers..]", "", yargs =>
    yargs
      .positional("method", {
        choices: Object.keys(HTTPMethod) as HTTPMethod[],
        coerce: (arg: string) => arg.toUpperCase() as HTTPMethod,
        description: "HTTP method",
      })
      .positional("url", {
        coerce: (url: string) => {
          if (!url.match("(http:|https:).*")) {
            throw new Error("Unsupported URL protocol");
          }
          return new URL(url);
        },
        description: "HTTP URL to request",
      })
      .positional("headers", {
        coerce: (arg: string[]) =>
          arg
            .map(header => {
              const headerArray = header.split(":");
              if (headerArray.length !== 2) {
                throw new Error("Malformed HTTP header");
              }
              return headerArray;
            })
            .reduce<HTTPHeaders>(
              (acc, [key, value]) => ({ [key]: value, ...acc }),
              {}
            ),
        description:
          "HTTP headers to send with the request, e.g. Content-Type:application/json",
      })
      .demandOption(["method", "url"])
  ).argv;

const requestOptions = {
  headers,
  rejectUnauthorized: !!insecure,
  auth: authCredentials
    ? { type: authType, credentials: authCredentials }
    : undefined,
};

getStdin()
  .pipe(request(method, url, requestOptions))
  .on("error", errorHandler)
  .on("response", ({ headers, responseStream }) => {
    if (verbose) {
      const outputStream = !process.stdout.isTTY
        ? process.stderr
        : process.stdout;

      outputStream.write(`${httpHeadersToString(headers)}\n\n`);
    }

    if (
      process.stdout.isTTY &&
      headers["content-type"] === "application/json"
    ) {
      streamToBuffer(responseStream)
        .on("error", errorHandler)
        .on("end", buffer =>
          process.stdout.write(colorizeJSON(buffer.toString()))
        );
    } else {
      responseStream.pipe(process.stdout);
    }
  });
