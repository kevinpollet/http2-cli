/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import jsonColorizer from "json-colorizer";
import yargs from "yargs";
import { URL } from "url";
import zlib from "zlib";
import { httpHeadersToString } from "./httpHeadersToString";
import { AuthenticationType } from "./AuthenticationType";
import { version } from "./version";
import { HttpMethod } from "./HttpMethod";
import { makeRequest } from "./makeRequest";
import { isHttpURL } from "./isHttpURL";
import { streamToBuffer } from "./streamToBuffer";
import { getStdin } from "./getStdin";
import { errorHandler } from "./errorHandler";
import { HttpHeaders } from "./HttpHeaders";

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
        choices: Object.keys(HttpMethod) as HttpMethod[],
        coerce: (arg: string) => arg.toUpperCase() as HttpMethod,
        description: "HTTP method",
      })
      .positional("url", {
        coerce: (url: string) => {
          if (!isHttpURL(url)) {
            throw new Error("Unsupported URL format");
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
            .reduce<HttpHeaders>(
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
  .pipe(makeRequest(method, url, requestOptions))
  .on("error", errorHandler)
  .on("response", function(this: NodeJS.ReadableStream, headers) {
    const contentEncoding = headers["content-encoding"];
    const stream =
      contentEncoding === "gzip" || contentEncoding === "deflate"
        ? this.pipe(zlib.createUnzip())
        : this;

    if (verbose) {
      process.stderr.write(`${httpHeadersToString(headers)}\n\n`);
    }

    if (
      process.stdout.isTTY &&
      headers["content-type"] === "application/json"
    ) {
      streamToBuffer(stream)
        .on("error", errorHandler)
        .on("end", buffer => {
          const options = { colors: { STRING_KEY: "blue" } };
          process.stdout.write(jsonColorizer(buffer.toString(), options));
        });
    } else {
      stream.pipe(process.stdout);
    }
  });
