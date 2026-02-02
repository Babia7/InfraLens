FROM node:20-alpine AS build

WORKDIR /app

# Build arguments for environment variables
ARG VITE_ADMIN_PIN
ENV VITE_ADMIN_PIN=$VITE_ADMIN_PIN

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
