FROM node:hydrogen-alpine3.19 AS build
WORKDIR /
<<<<<<< Updated upstream
COPY /package*.json .
=======
COPY /package*.json ./
>>>>>>> Stashed changes
RUN npm install
COPY / .
RUN npm run build

FROM python:3.10
COPY --from=build /dist ./
RUN apt-get -y update
EXPOSE 3333
CMD ["python3", "-m", "http.server", "3333"]