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

## Architecture

### Overview

The News Aggregator is built using a modern React architecture with Redux Toolkit for state management and RTK Query for API integration. The application follows a feature-based organization pattern with clear separation of concerns.

### Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit with Redux Persist
- **API Layer**: RTK Query (Redux Toolkit Query)
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Testing**: Vitest (unit tests) + Playwright (E2E tests)

### Application Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Application                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │              App Component (Root)                  │  │
│  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │      Redux Provider + PersistGate            │ │  │
│  │  │  ┌────────────────────────────────────────┐  │ │  │
│  │  │  │      BrowserRouter                     │  │ │  │
│  │  │  │  ┌──────────────────────────────────┐  │  │ │  │
│  │  │  │  │      Layout Component            │  │  │ │  │
│  │  │  │  │  ┌────────────────────────────┐  │  │ │  │ │
│  │  │  │  │  │      Page Components       │  │  │ │  │ │
│  │  │  │  │  │  ┌──────────────────────┐  │  │ │  │ │ │
│  │  │  │  │  │  │   Feature Components │  │  │ │  │ │ │
│  │  │  │  │  │  │   (NewsList, etc.)   │  │  │ │  │ │ │
│  │  │  │  │  │  └──────────────────────┘  │  │ │  │ │ │
│  │  │  │  │  └────────────────────────────┘  │  │ │  │ │
│  │  │  │  └──────────────────────────────────┘  │  │ │  │
│  │  │  └────────────────────────────────────────┘  │  │ │
│  │  └──────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Redux Store │    │  RTK Query   │    │   External   │
│              │    │   API Slice  │    │     APIs     │
│  - App State │    │              │    │              │
│  - Feed      │    │  - Guardian  │    │  - Guardian  │
│  Settings    │    │  - NY Times  │    │  - NY Times  │
│              │    │  - News API  │    │  - News API  │
└──────────────┘    └──────────────┘    └──────────────┘
```

### State Management

The application uses **Redux Toolkit** with the following structure:

1. **Store Configuration** (`src/store/index.ts`)
   - Combines multiple reducers using `combineReducers`
   - Integrates RTK Query API slices as reducers
   - Configures Redux Persist for state persistence (feed settings)
   - Sets up middleware for RTK Query API caching

2. **Redux Slices**:
   - **App Slice**: Application-level state (e.g., mobile detection)
   - **Feed Setting Slice**: User filter preferences (persisted to localStorage)
   - **API Slices**: Three separate RTK Query slices for each news source

3. **State Persistence**:
   - Uses `redux-persist` to save feed settings to localStorage
   - Only feed settings are persisted (whitelisted)
   - App state and API cache are not persisted

### API Integration Pattern

The application integrates with three news APIs using **RTK Query**:

1. **API Structure** (`src/api/`):
   - Each API has its own file: `guardian.ts`, `ny-times.ts`, `news-api.ts`
   - Each API slice uses `createApi` from RTK Query
   - Custom `queryFn` implementations handle URL building and response transformation

2. **Data Flow**:
   ```
   Component → useLazyQuery Hook → RTK Query → API Call → Transform Response → Update Cache → Component Re-render
   ```

3. **Response Transformation**:
   - Each API has a unique response format
   - Transformation functions normalize responses to a common `Article` type
   - Transformed data is stored in RTK Query cache

4. **API Features**:
   - Automatic caching and deduplication
   - Lazy query hooks for on-demand fetching
   - Base query configuration for error handling
   - Type-safe API responses

### Component Architecture

The application follows a **feature-based component organization**:

1. **Pages** (`src/pages/`):
   - Top-level route components
   - Minimal logic, mainly composition
   - Examples: `HomePage`, `FeedPage`, `NotFoundPage`

2. **Features** (`src/features/`):
   - Self-contained feature modules
   - Include components, hooks, and related logic
   - Examples: `news-list/`, `sidebar-portal/`, `navbar-lef-slot-portal/`
   - Each feature can have:
     - Main component
     - Custom hooks (e.g., `use-news/`)
     - Sub-components
     - Constants and utilities

3. **Components** (`src/components/`):
   - Reusable, generic UI components
   - No business logic dependencies
   - Examples: `Button`, `Card`, `Input`, `Modal`, `Grid`
   - Each component has its own directory with tests

4. **Layout** (`src/app/layout/`):
   - Application shell component
   - Handles responsive layout
   - Provides portals for feature injection (sidebar, navbar)

### Data Flow

1. **User Interaction**:
   - User interacts with filters or scrolls to load more
   - Component calls `useNews` hook or directly uses RTK Query hooks

2. **State Update**:
   - Filter changes update local state in `useNews` hook
   - Debounced filters trigger API calls
   - RTK Query manages API state (loading, error, data)

3. **API Calls**:
   - Multiple API calls made in parallel using `Promise.all`
   - Each API call is independent and can succeed/fail separately
   - Responses are transformed and cached by RTK Query

4. **UI Update**:
   - Components re-render based on state changes
   - Loading states shown during API calls
   - Articles displayed in a grid layout
   - Infinite scroll triggers additional page loads

### Routing

The application uses **React Router v6** with a simple routing structure:

- `/` - Home page (main news feed)
- `/feed` - Feed page (alternative view)
- `*` - 404 page for unmatched routes

Routes are defined in `src/app/index.tsx` with a shared `Layout` component wrapping all pages.

### Custom Hooks

The application uses several custom hooks for reusable logic:

- **`useNews`**: Main hook for news fetching and filtering logic
  - Manages filter state with debouncing
  - Coordinates multiple API calls
  - Handles pagination and infinite scroll
  - Combines articles from multiple sources

- **`useDebounce`**: Debounces filter changes to reduce API calls
- **`useMount`**: Handles component mount lifecycle
- **`useRouterMatch`**: Router utility hook

### Key Design Decisions

1. **RTK Query over Fetch**: Provides caching, deduplication, and automatic state management
2. **Lazy Queries**: API calls are made on-demand rather than automatically on mount
3. **Feature-based Organization**: Keeps related code together for better maintainability
4. **Portal Pattern**: Allows features to inject UI into layout slots (sidebar, navbar)
5. **Component Composition**: Small, focused components that compose into larger features
6. **TypeScript First**: Strong typing throughout for better developer experience and fewer bugs

### State Management Flow

```
┌─────────────┐
│   User      │
│  Action     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Component      │
│  (useNews hook) │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐      ┌──────────────┐
│  RTK Query      │─────▶│  API Call    │
│  (Lazy Query)   │      │  (Guardian,  │
└──────┬──────────┘      │   NY Times,  │
       │                 │   News API)  │
       ▼                 └──────────────┘
┌─────────────────┐              │
│  Redux Store    │◀─────────────┘
│  (Cache Update) │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Component      │
│  Re-render      │
└─────────────────┘
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

## Known Issues

### API Error Handling

- **Silent Failures**: API errors are not properly handled or displayed to users. When API calls fail, the application fails silently without showing error messages or fallback UI.
- **No Error Recovery**: There's no retry mechanism for failed API requests.
- **Partial Failures**: If one API source fails while others succeed, the error is not communicated to the user.

### E2E Test Performance

- **Slow Execution**: E2E tests are slow and prone to timeouts, especially in CI/CD environments.
- **Timeout Issues**: Tests frequently timeout due to hardcoded wait times and inefficient waiting strategies.
- **Flaky Tests**: Tests may fail intermittently due to race conditions and timing issues.

### Test Coverage Gaps

- **Missing Error Cases**: Unit tests do not cover API error scenarios, network failures, or malformed responses.
- **Edge Cases**: Tests don't cover edge cases such as:
  - Very long search queries
  - Invalid date ranges
  - Empty API responses
  - Partial API failures (one source fails, others succeed)
  - Network timeouts
  - Rate limiting scenarios

## Bad Practices

### E2E Tests

- **Hardcoded Timeouts**: Multiple uses of `waitForTimeout()` instead of waiting for actual conditions (found in `tests/e2e/index.spec.ts`). This makes tests slow, flaky, and unreliable.
- **No Proper Error Assertions**: The error handling test doesn't verify that errors are actually displayed to users.

### Code Quality

- **Unhandled Promise Rejections**: In `src/features/news-list/use-news/index.ts`, the `Promise.all()` call lacks proper error handling with `.catch()`, causing silent failures.
- **No Error Boundaries**: Missing React error boundaries to catch and display runtime errors gracefully.
- **No User Feedback**: No error UI components or toast notifications to inform users when something goes wrong.

## Improvements Needed

### Error Handling

1. **Implement Comprehensive Error Handling**
   - Add `.catch()` handlers to all API promise chains
   - Create error UI components to display errors to users
   - Implement error boundaries for React error handling
   - Add toast notifications or error banners for user feedback

2. **API Error Recovery**
   - Implement retry logic with exponential backoff for failed API requests
   - Add fallback mechanisms when APIs are unavailable
   - Handle partial failures gracefully (show data from successful sources, errors for failed ones)

3. **Error Logging**
   - Integrate error tracking service (e.g., Sentry, LogRocket)
   - Log API errors with context for debugging
   - Track error rates and patterns

### Testing

1. **Improve E2E Test Quality**
   - Replace all `waitForTimeout()` calls with proper wait conditions (e.g., `waitFor()`, `waitForSelector()`)
   - Use Playwright's built-in waiting mechanisms
   - Add proper error state assertions
   - Optimize test execution time

2. **Expand Test Coverage**
   - Add unit tests for error scenarios (API failures, network errors, malformed responses)
   - Test edge cases (empty responses, partial failures, rate limiting)
   - Add integration tests for error handling flows
   - Test error UI components

3. **Test Performance**
   - Reduce test execution time by optimizing wait strategies
   - Consider parallel test execution where possible
   - Add test timeouts that are appropriate for the operations being tested

### Code Quality

1. **Type Safety**
   - Add stricter TypeScript configurations
   - Ensure all API responses are properly typed
   - Add runtime validation for API responses

2. **User Experience**
   - Add loading states for better user feedback
   - Implement skeleton loaders during data fetching
   - Add empty states when no articles are found
   - Improve error messages to be user-friendly

3. **Performance**
   - Implement request debouncing more effectively
   - Add request cancellation for stale requests
   - Optimize re-renders with proper memoization
   - Consider implementing virtual scrolling for large article lists
