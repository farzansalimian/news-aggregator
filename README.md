# News Aggregator

A modern news aggregation application built with React, TypeScript, and Vite that fetches news from multiple sources including News API, The Guardian, and The New York Times.

## Features

- 📰 Aggregates news from multiple sources
- 🔍 Advanced filtering and search capabilities
- 📅 Date range picker for filtering news by date
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast development experience with Vite
- 🧪 Comprehensive test coverage with Vitest and Playwright

## Prerequisites

- Docker and Docker Compose installed on your system
- (Optional) Node.js 20+ and pnpm for local development

## Environment Variables

The application requires the following environment variables for API access:

- `VITE_NEWS_API_KEY` - API key for News API
- `VITE_GUARDIAN_KEY` - API key for The Guardian API
- `VITE_NY_TIMES_KEY` - API key for The New York Times API

Create a `.env` file in the root directory with your API keys:

```env
VITE_NEWS_API_KEY=your_news_api_key
VITE_GUARDIAN_KEY=your_guardian_key
VITE_NY_TIMES_KEY=your_ny_times_key
```

## Running with Docker

### Production Build

To build and run the production version of the application:

```bash
# Build and start the container
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

The application will be available at `http://localhost:3000`

To stop the container:

```bash
docker-compose down
```

### Development Mode

To run the application in development mode with hot module replacement:

```bash
# Start the development server
docker-compose --profile dev up dev --build

# Or run in detached mode
docker-compose --profile dev up -d dev --build
```

The development server will be available at `http://localhost:5173`

### Using npm/pnpm Scripts (Recommended)

For convenience, you can use npm/pnpm scripts to manage Docker containers:

#### Production Commands

```bash
# Build the production image
pnpm docker:build

# Start the production container (detached)
pnpm docker:up

# View production logs
pnpm docker:logs

# Stop containers
pnpm docker:down
```

#### Development Commands

```bash
# Start the development server (builds and starts)
pnpm docker:dev
```

#### Testing Commands

```bash
# Run unit tests in Docker
pnpm docker:test

# Run E2E tests in Docker
pnpm docker:test:e2e
```

### Using Docker Commands Directly

#### Production Build

```bash
# Build the Docker image
docker build -t news-aggregator:latest .

# Run the container
docker run -p 3000:80 \
  -e VITE_NEWS_API_KEY=your_key \
  -e VITE_GUARDIAN_KEY=your_key \
  -e VITE_NY_TIMES_KEY=your_key \
  news-aggregator:latest
```

#### Development Build

```bash
# Build the development Docker image
docker build -f Dockerfile.dev -t news-aggregator:dev .

# Run the development container
docker run -p 5173:5173 \
  -v $(pwd):/app \
  -e VITE_NEWS_API_KEY=your_key \
  -e VITE_GUARDIAN_KEY=your_key \
  -e VITE_NY_TIMES_KEY=your_key \
  news-aggregator:dev
```

## Local Development (Without Docker)

If you prefer to run the application locally without Docker:

1. Install dependencies:

```bash
pnpm install
```

2. Create a `.env` file with your API keys (see Environment Variables section)

3. Start the development server:

```bash
pnpm dev
```

4. Build for production:

```bash
pnpm build
```

5. Preview the production build:

```bash
pnpm preview
```

## Testing

### Local Testing (Without Docker)

#### Unit Tests

```bash
pnpm test
```

#### End-to-End Tests

```bash
pnpm test:e2e
```

### Testing in Docker

All tests can be run in Docker containers for consistent environments:

#### Unit Tests in Docker

```bash
pnpm docker:test
```

#### E2E Tests in Docker

```bash
pnpm docker:test:e2e
```

The E2E tests will automatically start the development server and run tests against it. Test results and reports will be available in the `test-results` and `playwright-report` directories.

## Project Structure

```
news-aggregator/
├── src/
│   ├── api/           # API integrations
│   ├── app/           # App configuration
│   ├── components/    # Reusable UI components
│   ├── features/      # Feature modules
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── store/         # Redux store configuration
│   └── utils/         # Utility functions
├── tests/             # E2E Test files
├── public/            # Static assets
├── Dockerfile         # Production Docker configuration
├── Dockerfile.dev     # Development Docker configuration
├── Dockerfile.test    # Test Docker configuration
├── docker-compose.yml # Docker Compose configuration
└── nginx.conf         # Nginx configuration for production
```

## Docker Image Details

### Production Image

- **Base Image**: `nginx:alpine` (lightweight production server)
- **Build Stages**: Multi-stage build for optimized image size
- **Port**: 80 (mapped to 3000 on host)
- **Health Check**: Available at `/health` endpoint

### Development Image

- **Base Image**: `node:20-alpine`
- **Port**: 5173 (Vite dev server)
- **Volume Mounts**: Source code mounted for hot reloading

### Test Image

- **Base Image**: `node:20-alpine`
- **Includes**: Playwright browsers (Chromium, Firefox, WebKit)
- **Volume Mounts**: Source code and test results directories
- **Used For**: Running unit tests and E2E tests in isolated environments

## Troubleshooting

### Container won't start

- Ensure port 3000 (production) or 5173 (development) is not already in use
- Check that environment variables are properly set
- Verify Docker and Docker Compose are installed and running

### API calls failing

- Verify your API keys are correct in the `.env` file
- Check that the environment variables are being passed to the container
- Ensure your API keys have the necessary permissions

### Build fails

- Clear Docker cache: `docker system prune -a`
- Rebuild without cache: `docker-compose build --no-cache`
