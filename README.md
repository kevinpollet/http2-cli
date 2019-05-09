# http2-cli &middot; [![Build Status](https://dev.azure.com/kevinpollet/http2-cli/_apis/build/status/kevinpollet.http2-cli?branchName=master)](https://dev.azure.com/kevinpollet/http2-cli/_build/latest?definitionId=2&branchName=master) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE.md)

```shell
$ npm install -g http2-cli
$ http2 get https://nghttp2.org/httpbin/get --verbose
```

👋 Since `npm@5.2.0` you can use `npx` to run a CLI tool without installing it globally, so you can use the following command:

```shell
$ npx http2-cli get https://nghttp2.org/httpbin/get --verbose
```

## Usage

```shell
http2 <method> <url>

Positionals:
  method  The HTTP method  [choices: "DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT", "PATCH"]
  url     The HTTP URL to request

Options:
  --version    Show version number  [boolean]
  --help       Show help  [boolean]
  --auth       The authentication credentials  [string]
  --auth-type  The authentication type  [choices: "Basic", "Bearer"] [default: "Basic"]
  --insecure   Disable the server certificate verification  [boolean]
  --verbose    Display the HTTP response headers  [boolean]
```

## License

[MIT](./LICENSE.md)
