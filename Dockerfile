FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

COPY server/package*.json server/
RUN yarn install-server --omit=dev 

COPY client/package*.json client/
RUN yarn install-client --omit=dev 


COPY client/ client
RUN npm run build --prefix client

COPY server/ server/

USER node

CMD ["yarn", "watch", "--prefix", "server"]

EXPOSE 8000