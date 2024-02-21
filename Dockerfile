From node

WORKDIR /therapy-marketplace

COPY . /therapy-marketplace

RUN yarn install  

RUN yarn build

CMD ["yarn", "start"]
