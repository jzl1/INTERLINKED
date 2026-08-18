FROM node:20-alpine AS builder

ARG REPO_URL=https://github.com/jzl1/INTERLINKED.git
ARG BRANCH=main

WORKDIR /app

RUN apk add --no-cache git \
    && git clone --depth 1 --branch ${BRANCH} ${REPO_URL} . \
    && npm ci --omit=dev --ignore-scripts \
    && npm cache clean --force \
    && rm -rf .git

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache tzdata busybox-extras

COPY --from=builder --chown=node:node /app /app
RUN mkdir -p /app/usrprefs /app/web \
    && cp .topserverstyle.css /app/web/.topserverstyle.css \
    && touch /app/web/topserver.html /app/web/serverlist.html /app/web/embed.json \
    && ln -sf /app/web/topserver.html /app/web/index.html \
    && ln -sf /app/web/topserver.html /app/topserver.html \
    && ln -sf /app/web/serverlist.html /app/serverlist.html \
    && ln -sf /app/web/embed.json /app/embed.json \
    && chown -R node:node /app

USER node

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "httpd -p 8080 -h /app/web && exec node start_bot.js \"$@\"", "--"]
CMD ["--raw"]
