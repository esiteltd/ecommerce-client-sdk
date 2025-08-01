# Ecommerce SDK

A TypeScript SDK for the Ecommerce API that provides type-safe API calls with built-in validation, error handling, and retry logic.

## Installation

```bash
npm install ecommerce-sdk
# or
yarn add ecommerce-sdk
```

## Quick Start

```typescript
import { OnatureSDK } from "ecommerce-sdk";

const sdk = OnatureSDK.create({
  baseUrl: "https://api.ecommerce.com",
  tenant: "your-tenant-id",
  apiKey: "your-api-key", // optional
});

// Generate TGS token
const tgsToken = await sdk.tgs.generate({
  device_identifier: "device-123",
});

## Configuration

```typescript
interface SDKConfig {
  baseUrl: string; // Your API base URL
  tenant: string; // Your tenant identifier
  apiKey?: string; // Optional API key for authentication
  timeout?: number; // Request timeout in ms (default: 10000)
  retries?: number; // Number of retries for failed requests (default: 3)
}
```

## Available Resources

### TGS (Token Generation Service)

```typescript
// Generate token
const token = await sdk.tgs.generate({
  device_identifier: "device-123",
});
```

### Authentication

```typescript
// Login
const auth = await sdk.auth.login({
  email: "user@example.com",
  password: "password123",
});

## Type Safety

All API responses are validated using Zod schemas and provide full TypeScript type safety:

```typescript
import type { Product, ProductListResponse } from "ecommerce-sdk";

const products: ProductListResponse = await sdk.products.list();
const product: Product = products.data[0];

// TypeScript will catch errors like this:
// product.invalidProperty; // ❌ TypeScript error
```

## Development

```bash
# Install dependencies
npm install

# Build the SDK
npm run build

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Type checking
npm run typecheck
```
