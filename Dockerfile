FROM node:12-alpine as builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY tsconfig.build.json .
COPY bin bin
COPY src src
RUN npm run build

FROM node:12-alpine
ENV NODE_ENV=production
RUN apk add --no-cache tini
WORKDIR /http2-cli
RUN chown -R node:node .
COPY package*.json ./
RUN npm install
COPY --from=builder /build/lib lib/
COPY --from=builder /build/bin bin/
RUN npm link
USER node
ENTRYPOINT [ "/sbin/tini","--", "http2"]
CMD [ "--help" ]
