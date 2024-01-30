# Base
FROM node:18.16.0
# Base dir

WORKDIR /proyecto_final

ARG ENV_FILE=.env.development

#docker build --build-arg ENV_FILE = .env_production
COPY package*.json ./
COPY ./src ./src
COPY $ENV_FILE ./

RUN npm install

EXPOSE 8080

CMD [ "npm", "run", "dev" ]

#compiler -- docker build -t server.js .
#exec -- docker run -p 8080:8080 server.js