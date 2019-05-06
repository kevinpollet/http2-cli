/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import { OutgoingHttpHeaders } from "http2";

interface Options {
  auth?: {
    type: string;
    credentials: string;
  };
  method: string;
  path: string;
}

export const getOutgoingHeaders = ({
  auth,
  method,
  path,
}: Options): OutgoingHttpHeaders => {
  const headers: OutgoingHttpHeaders = {
    ":method": method.toUpperCase(),
    ":path": path,
  };

  if (auth) {
    headers.authorization =
      auth.type === "basic"
        ? `Basic ${Buffer.from(auth.credentials).toString("base64")}`
        : `Bearer ${auth.credentials}`;
  }

  return headers;
};
