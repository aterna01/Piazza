FROM alpine
RUN apk add --update nodejs npm
COPY . /run
WORKDIR run
EXPOSE 3000
ENTRYPOINT ["node", "src/index.js"]