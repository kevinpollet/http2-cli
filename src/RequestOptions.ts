/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

import { AuthenticationType } from "./AuthenticationType";
import { HttpHeaders } from "./HttpHeaders";

export interface RequestOptions {
  auth?: {
    type: AuthenticationType;
    credentials: string;
  };
  headers?: HttpHeaders;
  rejectUnauthorized?: boolean;
}
