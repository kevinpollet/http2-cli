# http2-cli &middot; [![Build Status](https://dev.azure.com/kevinpollet/http2-cli/_apis/build/status/kevinpollet.http2-cli?branchName=master)](https://dev.azure.com/kevinpollet/http2-cli/_build/latest?definitionId=2&branchName=master) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE.md)

> Modern and lightweight command line HTTP/2 client ✨🍪

## Install

```shell
$ npm install -g http2-cli
```

Since version `5.2.0`, a new package runner tool called [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) is shipped with npm. With this new tool you can run any node package binary from the command line without installing it globally first. So you can run `http2-cli` with the following command line:

```shell
$ npx http2-cli --help
```

## Usage

```shell
http2 <method> <url> [headers..]

Positionals:
  method   HTTP method  [required] [choices: "DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT", "PATCH"]
  url      HTTP URL to request  [required]
  headers  HTTP headers to send with the request, e.g. Content-Type:application/json

Options:
  --help       Show help  [boolean]
  --version    Show version number  [boolean]
  --auth       Specify the authentication credentials  [string]
  --auth-type  Specify the authentication mechanism  [choices: "Basic", "Bearer"] [default: "Basic"]
  --insecure   Disable the host SSL/TLS certificate verification  [boolean]
  --verbose    Display the HTTP response headers  [boolean]
```

## Examples

Here are some command examples with the corresponding output:

### GET request with basic authentication

```shell
$ http2 get https://nghttp2.org:443/httpbin/basic-auth/test/test --auth test:test
{
  "authenticated": true,
  "user": "test"
}
```

### POST request with redirected input

```shell
$ http2 post https://nghttp2.org:443/httpbin/post Content-Type:application/json < foo.json
{
  "args": {},
  "data": "{\n  \"bar\": \"baz\"\n}\n",
  "files": {},
  "form": {},
  "headers": {
    "Content-Type": "application/json",
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

## ️️Docker

For docker ❤️ you can run `http2-cli` with docker. Currently, you'll have to build the docker image from the sources or to build your custom image. Here are the commands to build and run `http2-cli` with docker:

```shell
$ git clone git@github.com:kevinpollet/http2-cli.git; cd http2-cli
$ docker build . -t http2-cli:latest
$ docker run --rm http2-cli:latest --version
http2-cli/1.0.0-alpha.4 linux-x64 node-v8.16.0
```

With docker, it's also possible to use Unix redirections and pipes! Try the following commands:

```shell
$ docker run --rm -i http2-cli:latest post https://nghttp2.org/httpbin/post < foo.json
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

$ echo -e '{ "hello": "world" }' | docker run --rm -i http2-cli:latest post https://nghttp2.org/httpbin/post | jq ".json"
{
  "hello": "world"
}
```

## Contributing

✨Contributions are welcome ✨

See [CONTRIBUTING.md](./CONTRIBUTING.md) for more information and how to get started.

## License

[MIT](./LICENSE.md)
