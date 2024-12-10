FROM node:latest
COPY . .
RUN npm install -g @angular/cli@14.2

EXPOSE 4200
CMD ["ng", "serve", "--open"]