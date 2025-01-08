# GhAI - Discord and Teams AI Assistant

A monorepo project containing AI-powered assistant implementations for Discord and Microsoft Teams.

## Project Structure

```
.
├── apps/
│   ├── discord-bot/    # Discord bot implementation
│   └── teams-bot/      # Teams bot implementation
└── packages/
    ├── core/           # Shared business logic
    ├── config/         # Shared configuration
    └── types/          # Shared TypeScript types
```

## Prerequisites

- [Bun](https://bun.sh) (JavaScript runtime and package manager)
- Discord Bot Token (for Discord bot)
- Microsoft Teams App credentials (for Teams bot)
- AI provider's API credentials

## Setup

1. Install Bun:
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Copy the environment variables file:
   ```bash
   cp .env.template .env
   ```

4. Configure your environment variables in `.env`:
   - For Discord bot:
     - `DISCORD_TOKEN`: Your Discord bot token
     - `DISCORD_CLIENT_ID`: Your Discord application client ID
     - `DISCORD_GUILD_ID`: Your Discord server ID
   
   - For Teams bot:
     - `TEAMS_APP_ID`: Your Teams application ID
     - `TEAMS_APP_PASSWORD`: Your Teams application password

## Development

1. Build all packages:
   ```bash
   bun run build
   ```

2. Start Discord bot:
   ```bash
   bun run dev:discord
   ```

3. Start Teams bot:
   ```bash
   bun run dev:teams
   ```

## Project Commands

- `bun run build` - Build all packages and applications
- `bun run dev:discord` - Start Discord bot in development mode
- `bun run dev:teams` - Start Teams bot in development mode
- `bun run test` - Run tests
- `bun run lint` - Run linting

## Adding AI Capabilities

The project is structured to easily add AI capabilities:

1. Implement your AI logic in the `packages/core` package
2. The message handler in `packages/core` will process messages from both Discord and Teams
3. Both bots use the same core logic, ensuring consistent behavior across platforms

## License

MIT
