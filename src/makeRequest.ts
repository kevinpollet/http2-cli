/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import http2, { OutgoingHttpHeaders } from "http2";
import pump from "pump";
import { URL } from "url";
import { HttpMethod } from "./HttpMethod";
import { AuthenticationType } from "./AuthenticationType";

interface Options {
  auth?: {
    type: AuthenticationType;
    credentials: string;
  };
  rejectUnauthorized?: boolean;
}

interface Response {
  headers: OutgoingHttpHeaders;
  stream: NodeJS.ReadableStream;
}

export const makeRequest = ({
  method,
  url,
  inputStream,
  options = {},
}: {
  method: HttpMethod;
  url: URL;
  inputStream: NodeJS.ReadableStream;
  options: Options;
}): Promise<Response> =>
  new Promise((resolve, reject) => {
    http2.connect(url, session => {
      const authorization =
        options.auth &&
        (options.auth.type === AuthenticationType.Bearer
          ? options.auth.credentials
          : Buffer.from(options.auth.credentials).toString("base64"));

      const stream = session.request({
        ":method": method,
        ":path": url.pathname + url.search,
        authorization,
      });

      pump(inputStream, stream)
        .once("response", headers => resolve({ headers, stream }))
        .once("error", err => {
          session.destroy();
          reject(err);
        })
        .once("end", () => {
          session.destroy();
          resolve();
        });
    });
  });
