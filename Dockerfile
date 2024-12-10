FROM alpine
RUN apk add --update nodejs npm
RUN npm install
COPY . /run
WORKDIR run
EXPOSE 3000
ENTRYPOINT ["node", "src/index.js"]