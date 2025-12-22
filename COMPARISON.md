# Kubb vs openapi-ts Comparison

## Executive Summary

This document compares the code generation between Kubb and openapi-ts (Hey API) to identify what's missing in Kubb to achieve similar code quality and structure.

## Key Differences

### 1. File Organization

**openapi-ts:**
- **Consolidated files**: All types in `types.gen.ts` (~67k lines)
- **Single SDK file**: All SDK functions in `sdk.gen.ts` (~18k lines)
- **Single Zod file**: All schemas in `zod.gen.ts` (~25k lines)
- **Client infrastructure**: Organized in `client/` and `core/` directories
- **Total files**: ~15 files

**Kubb:**
- **Split files**: Individual files per operation (~2000+ files)
- Types: One file per type in `types/` directory
- API functions: One file per operation in `api/` directory
- Schemas: One file per schema in `schemas/` directory
- Mocks: One file per mock in `mocks/` directory
- **Total files**: 2049 files

### 2. Type Generation

**openapi-ts:**
- Uses `type` keyword for types
- Consolidated in single file
- Clean, readable types with JSDoc comments
- Example:
```typescript
export type Account = {
    readonly active_since?: string;
    address_1?: string;
    // ... all properties in one place
};
```

**Kubb:**
- Uses `interface` keyword (configured with `syntaxType: 'interface'`)
- Split across multiple files
- Separate files for request/response types
- Example structure:
```typescript
// types/Account.ts
export interface Account {
  // properties
}
```

### 3. SDK/Client Functions

**openapi-ts:**
- All functions exported from single `sdk.gen.ts` file
- Functions use arrow syntax with type parameters
- Integrated with client instance
- Example:
```typescript
export const getAccount = <ThrowOnError extends boolean = true>(
  options?: Options<GetAccountData, ThrowOnError>
) => (options?.client ?? client).get<GetAccountResponses, GetAccountErrors, ThrowOnError, 'data'>({
    responseStyle: 'data',
    security: [{ scheme: 'bearer', type: 'http' }],
    url: '/account',
    ...options
});
```

**Kubb:**
- Each function in separate file
- Functions use async/await
- Manual fetch implementation
- Example:
```typescript
export async function getAccount(
  config: Partial<RequestConfig> & { client?: typeof fetch } = {}
) {
  const { client: request = fetch, ...requestConfig } = config;
  const res = await request<GetAccountQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: "GET",
    url: getGetAccountUrl().url.toString(),
    ...requestConfig
  });
  return res.data;
}
```

### 4. Bundling Configuration

**openapi-ts:**
- Single bundled files by design
- `exportFromIndex: false` for plugins
- Clean separation of concerns

**Kubb:**
- `bundle: true` for client plugin
- `barrelType: 'all'` for output and mocks
- Still generates many individual files

### 5. Schema Generation (Zod)

**openapi-ts:**
- Single consolidated `zod.gen.ts` file
- Schema naming: `${name}Schema`, `${name}RequestSchema`, `${name}ResponseSchema`
- All schemas in one place

**Kubb:**
- Individual schema files in `schemas/` directory
- Schema naming follows type names
- Separate file per schema

### 6. TypeScript Errors

**openapi-ts:**
- 9 TypeScript errors (mostly in tests and missing peer dependencies)
- Core generated code is valid
- Errors:
  - URLSearchParams compatibility (3 errors)
  - Missing `zod` peer dependency (1 error)
  - Missing test dependencies (5 errors)

**Kubb:**
- 115+ TypeScript errors in generated code
- Main issues:
  - Missing `@faker-js/faker` imports in mocks
  - Duplicate exports for GetMaintenance200
  - Complex filter type issues
  - Missing FormData type
- These are in production code, not just tests

## What's Missing in Kubb

### 1. File Consolidation
Kubb lacks the ability to consolidate all types, SDK functions, and schemas into single files like openapi-ts does. While it has a `bundle` option, it doesn't work the same way.

### 2. Cleaner Generated Code
- openapi-ts generates cleaner, more type-safe functions
- Better integration with client infrastructure
- More robust error handling

### 3. Better Default Configuration
- openapi-ts has better defaults that generate valid code
- Kubb requires more configuration tweaking
- Need to handle edge cases better (duplicate exports, etc.)

### 4. Dependency Management
- Kubb's faker plugin generates code with missing imports
- Should be a devDependency or properly imported

### 5. Type System
- openapi-ts uses more sophisticated TypeScript features (conditional types, better generics)
- Kubb's interface-based approach is simpler but less flexible

## Recommendations for Kubb Improvements

### 1. Configuration Changes

Update `kubb.config.ts` to:
- Use `type` instead of `interface` for better compatibility
- Bundle all types into single file
- Bundle all SDK functions into single file
- Bundle all schemas into single file
- Fix faker imports or make it optional

### 2. Code Quality

- Fix duplicate exports (GetMaintenance200 issue)
- Improve FormData type handling
- Better handling of complex filter types
- Ensure generated code is TypeScript error-free

### 3. Plugin Improvements

- Improve pluginClient bundling to create single SDK file
- Improve pluginTs to create single types file
- Improve pluginZod to create single schemas file
- Make pluginFaker optional or fix imports

### 4. Match openapi-ts Structure

Target structure:
```
src/
  types.gen.ts       # All types
  sdk.gen.ts         # All SDK functions
  zod.gen.ts         # All Zod schemas
  client.gen.ts      # Client configuration
  index.ts           # Main export
  client/            # Client infrastructure
  core/              # Core utilities
```

## Conclusion

The main gap between Kubb and openapi-ts is:

1. **File organization**: openapi-ts consolidates into fewer, larger files while Kubb creates many small files
2. **Code quality**: openapi-ts generates more valid TypeScript out of the box
3. **Developer experience**: openapi-ts is easier to use with better defaults
4. **Type safety**: openapi-ts uses more advanced TypeScript features for better type safety

To achieve parity with openapi-ts, Kubb needs:
- Better bundling/consolidation options
- Cleaner generated code with fewer errors
- Better dependency management
- More sophisticated type generation
