FROM node:22.13.1-slim
ENV NODE_ENV=production

WORKDIR /usr/src/app
COPY ./package.json ./package-lock.json ./
RUN npm clean-install --omit=dev
COPY ./ ./

CMD ["node", "index.js"]
