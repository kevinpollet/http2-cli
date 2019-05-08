FROM node:8-alpine as build
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY tsconfig.json .
COPY bin bin
COPY src src
RUN npm run build

FROM node:8-alpine
RUN apk add --no-cache tini
ENV NODE_ENV=production
WORKDIR /http2-cli
RUN chown -R node:node .
USER node
COPY package*.json ./
RUN npm install
COPY --from=build /build/lib lib/
COPY --from=build /build/bin bin/
ENTRYPOINT [ "/sbin/tini","--", "bin/http2.js"]
CMD [ "--version" ]
