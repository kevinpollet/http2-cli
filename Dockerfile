FROM node:12-alpine AS builder
WORKDIR /build
RUN chown -R node:node .
USER node
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.build.json .
COPY bin bin
COPY src src
RUN npm run build \
  && npm prune --production

FROM node:12-alpine
RUN apk add --no-cache tini
WORKDIR /http2-cli
RUN chown -R node:node .
USER node
COPY --from=builder /build/package.json /build/package-lock.json ./
COPY --from=builder /build/node_modules node_modules/
COPY --from=builder /build/bin bin/
COPY --from=builder /build/lib lib/
ENTRYPOINT [ "/sbin/tini","--", "node", "bin/http2"]
CMD [ "--help" ]
