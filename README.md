# http2-cli &middot; [![Build Status](https://dev.azure.com/kevinpollet/http2-cli/_apis/build/status/kevinpollet.http2-cli?branchName=master)](https://dev.azure.com/kevinpollet/http2-cli/_build/latest?definitionId=2&branchName=master) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE.md)

> 🥃 Modern and lightweight Command Line Interface for HTTP/2

## Install

```shell
$ npm install -g http2-cli
```

Since `npm@5.2.0`, a new package runner tool called [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b). With this new tool you can run any node package binary from the command line without installing it globally first. So you can run `http2-cli` with the following command line:

```shell
$ npx http2-cli --help
```

## Table of Contents

- [Usage](#usage)
- [Examples](#examples)
- [License](#license)

## Usage

```shell
http2 <method> <url>

Positionals:
  method  The HTTP method  [required] [choices: "DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT", "PATH"]
  url     The HTTP URL to request  [required]

Options:
  --help       Show help  [boolean]
  --version    Show version number  [boolean]
  --auth       The authentication credentials  [string]
  --auth-type  The authentication type  [choices: "Basic", "Bearer"] [default: "Basic"]
  --insecure   Disable the server certificate verification  [boolean]
  --verbose    Display the HTTP response headers  [boolean]
```

## Examples

Here are some command examples with the corresponding output:

### GET request

```shell
$ http2 get https://nghttp2.org:443/httpbin/get\?query\=hello
{
  "args": {
    "query": "hello"
  },
  "headers": {
    "Host": "nghttp2.org:443"
  },
  "origin": "129.122.96.213",
  "url": "https://nghttp2.org:443/httpbin/get?query=hello"
}
```

### Authenticated GET request

```shell
$ http2 get https://nghttp2.org:443/httpbin/basic-auth/test/test --auth test:test
{
  "authenticated": true,
  "user": "test"
}
```

### POST request with redirected input

```shell
$ http2 post https://nghttp2.org:443/httpbin/post < foo.json
{
  "args": {},
  "data": "{\n  \"bar\": \"baz\"\n}\n",
  "files": {},
  "form": {},
  "headers": {
    "Host": "nghttp2.org:443",
    "Transfer-Encoding": "chunked"
  },
  "json": {
    "bar": "baz"
  },
  "origin": "129.122.96.213",
  "url": "https://nghttp2.org:443/httpbin/post"
}
```

## License

[MIT](./LICENSE.md)
