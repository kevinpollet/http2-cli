/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */

export const isHttpURL = (url: string): boolean =>
  url.startsWith("http:") || url.startsWith("https:");
