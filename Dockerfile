FROM oven/bun:1.0.25

WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lockb tsconfig.json ./
COPY packages packages/
COPY apps apps/
RUN bun install

# Build all packages
RUN bun run build

EXPOSE 3000 3978

# Start both bots
CMD bun run dev:discord & bun run dev:teams & wait
