/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import { OutgoingHttpHeaders } from "http2";
import { AuthenticationType } from "./AuthenticationType";

interface Headers {
  auth?: {
    type: AuthenticationType;
    credentials: string;
  };
  method: string;
  path: string;
}

export const toOutgoingHeaders = ({
  auth,
  method,
  path,
}: Headers): OutgoingHttpHeaders => ({
  ":method": method,
  ":path": path,
  authorization:
    auth &&
    `${auth.type} ${
      auth.type === AuthenticationType.Basic
        ? Buffer.from(auth.credentials).toString("base64")
        : auth.credentials
    }`,
});
