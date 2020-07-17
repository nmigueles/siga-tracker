FROM node:12-alpine

ENV NODE_ENV=production

# Get chromium.
RUN apk add -U --no-cache --allow-untrusted udev ttf-freefont chromium git

# Skip npm chromium download and set the path.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROMIUM_PATH /usr/bin/chromium-browser

# Get dumb-init to avoid zombie processes
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY tsconfig.json .

RUN npm run build

COPY . .

ENTRYPOINT ["dumb-init", "--"]

CMD [ "npm", "start"]
