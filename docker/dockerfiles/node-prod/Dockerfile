FROM node:latest

RUN apt-get update && apt-get install -y \
    mysql-client \
    git \
&& rm -rf /var/lib/apt/lists/*

RUN npm i npm@latest -g
RUN npm install -g nodemon mocha
EXPOSE 3000

RUN git clone https://github.com/UEAesperanto/REST-API.git /app && \
  cd /app && \
  npm install

WORKDIR /app

COPY ./entrypoint.sh /
CMD [ "bash", "/entrypoint.sh"]
