/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import http2 from "http2";
import { URL } from "url";
import { HttpMethod } from "./HttpMethod";
import { AuthenticationType } from "./AuthenticationType";
import { RequestOptions } from "./RequestOptions";

export const makeRequest = (
  method: HttpMethod,
  url: URL,
  options: RequestOptions = {}
): NodeJS.WritableStream => {
  const auth = options.auth;
  const authCredentials =
    auth &&
    (auth.type === AuthenticationType.Bearer
      ? auth.credentials
      : Buffer.from(auth.credentials).toString("base64"));

  const session = http2.connect(url);
  const duplexStream = session.request({
    ":method": method,
    ":path": url.pathname + url.search,
    authorization: auth && `${auth.type} ${authCredentials}`,
  });

  return duplexStream
    .once("error", () => session.destroy())
    .once("end", () => session.destroy());
};
