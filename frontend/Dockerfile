FROM node:22-alpine
WORKDIR /app

RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ENV VITE_API_URL=http://localhost:8080

EXPOSE 5173
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
