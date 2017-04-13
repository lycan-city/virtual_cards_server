FROM node:alpine

ENV PROJECT_ROOT /home/node/app/

# App directory
RUN mkdir -p $PROJECT_ROOT

WORKDIR $PROJECT_ROOT

COPY package.json $PROJECT_ROOT

RUN npm install --dev

COPY . .

EXPOSE 80

CMD [ "npm", "start" ]

