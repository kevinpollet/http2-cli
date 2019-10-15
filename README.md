# http2-cli &middot; [![Build Status](https://dev.azure.com/kevinpollet/http2-cli/_apis/build/status/kevinpollet.http2-cli?branchName=master)](https://dev.azure.com/kevinpollet/http2-cli/_build/latest?definitionId=2&branchName=master) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE.md)

> Modern and lightweight command line HTTP/2 client.

## Install

**npm**

```shell
$ npx http2-cli             # Use it once.
$ npm install -g http2-cli  # Install globally.
```

**yarn**

```shell
$ yarn global add http2-cli # Install globally.
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

For docker ❤️ you can run `http2-cli` with docker. You can use a prebuilt docker image or build your own. For example the following command run the latest prebuilt docker image of `http2-cli`:

```shell
$ docker run --rm kevinpollet/http2-cli:latest --version
http2-cli/1.1.0 linux-x64 node-v12.3.1
```

With docker, it's also possible to use Unix redirections and pipes! Try the following commands:

```shell
$ docker run --rm -i kevinpollet/http2-cli:latest post https://nghttp2.org/httpbin/post < foo.json
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

$ echo -e '{ "hello": "world" }' | docker run --rm -i kevinpollet/http2-cli:latest post https://nghttp2.org/httpbin/post | jq ".json"
{
  "hello": "world"
}
```

## Contributing

Contributions are welcome!

Want to file a bug, request a feature or contribute some code?

Check out the [contribution guidelines](./CONTRIBUTING.md).

## License

[MIT](./LICENSE.md)
