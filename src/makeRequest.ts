/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import http2, { IncomingHttpHeaders } from "http2";
import { PassThrough } from "stream";
import { URL } from "url";
import zlib from "zlib";
import { HttpMethod } from "./HttpMethod";
import { AuthenticationType } from "./AuthenticationType";
import { RequestOptions } from "./RequestOptions";

export const makeRequest = (
  method: HttpMethod,
  url: URL,
  { auth, headers, rejectUnauthorized }: RequestOptions = {}
): NodeJS.WritableStream => {
  const passTroughStream = new PassThrough();

  const isAuthCredentialsInURL =
    url.username.length > 0 && url.password.length > 0;

  const authCredentials =
    auth &&
    (auth.type === AuthenticationType.Bearer
      ? auth.credentials
      : Buffer.from(auth.credentials).toString("base64"));

  const session = http2.connect(url, { rejectUnauthorized });
  const duplexStream = session.request({
    ":method": method,
    ":path": url.pathname + url.search,
    "accept-encoding": "gzip, deflate",
    authorization: isAuthCredentialsInURL
      ? `Basic ${Buffer.from(`${url.username}:${url.password}`).toString(
          "base64"
        )}`
      : auth && `${auth.type} ${authCredentials}`,
    ...headers,
  });

  passTroughStream
    .pipe(duplexStream)
    .once("error", err => {
      session.destroy();
      passTroughStream.emit("error", err);
    })
    .once("end", () => {
      session.destroy();
      passTroughStream.emit("end");
    })
    .on("response", (headers: IncomingHttpHeaders) => {
      const contentEncoding = headers["content-encoding"];
      const responseStream =
        contentEncoding === "gzip" || contentEncoding === "deflate"
          ? duplexStream.pipe(zlib.createUnzip())
          : duplexStream;

      passTroughStream.emit("response", { headers, responseStream });
    });

  return passTroughStream;
};
