# Key Findings: Kubb vs openapi-ts

## TL;DR

**openapi-ts** (Hey API) generates cleaner, more consolidated code with fewer files (~15) and fewer errors (9 in tests only). It's ready to use with minimal configuration.

**Kubb** offers more features (like mock data generation) and plugin flexibility, but generates many more files (2000+) and has more TypeScript errors (115+) that need fixing. It requires more configuration to match openapi-ts quality.

## What's Missing in Kubb

To have the same generated code quality as openapi-ts, Kubb needs:

### 1. File Consolidation ⭐ **Most Important**

**openapi-ts approach:**
```
src/
  types.gen.ts       (67k lines - ALL types)
  sdk.gen.ts         (18k lines - ALL functions)
  zod.gen.ts         (25k lines - ALL schemas)
  client.gen.ts      (16 lines - client setup)
  index.ts           (3 lines - main export)
```

**Kubb approach:**
```
src/
  types/             (1000+ individual type files)
  api/              (1000+ individual function files)
  schemas/          (1000+ individual schema files)
  mocks/            (1000+ individual mock files)
  index.ts          (2000+ export lines)
```

**Impact**: Developers using openapi-ts get cleaner imports and smaller bundle sizes. Kubb's many files can be harder to navigate and understand.

**Kubb Limitation**: The current architecture doesn't support true consolidation. The `bundle: true` option helps but doesn't create single files.

### 2. Valid TypeScript Out of the Box

**openapi-ts**: 9 errors total
- 3 in core utilities (URLSearchParams compatibility)
- 6 in test files (missing test dependencies)
- ✅ **0 errors in generated types, schemas, or SDK functions**

**Kubb**: 115+ errors total
- Missing `@faker-js/faker` imports in ALL mock files
- Duplicate exports (e.g., GetMaintenance200)
- Complex filter type issues
- Missing FormData types
- ❌ **Errors in production-generated code**

**Impact**: Developers using openapi-ts can use the generated code immediately. Kubb requires fixes before use.

### 3. Better Type Generation

**openapi-ts example:**
```typescript
export const getAccount = <ThrowOnError extends boolean = true>(
  options?: Options<GetAccountData, ThrowOnError>
) => (options?.client ?? client).get<
  GetAccountResponses,
  GetAccountErrors,
  ThrowOnError,
  'data'
>({
  responseStyle: 'data',
  security: [{ scheme: 'bearer', type: 'http' }],
  url: '/account',
  ...options
});
```

**Kubb example:**
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

**Differences**:
- openapi-ts uses more advanced TypeScript (conditional types, better generics)
- openapi-ts has better error handling built-in
- openapi-ts integrates better with client infrastructure
- Kubb is simpler but less type-safe

### 4. Configuration Simplicity

**openapi-ts config** (11 lines):
```typescript
export default defineConfig({
  input: './openapi.json',
  output: 'src',
  plugins: [
    { name: '@hey-api/client-fetch', throwOnError: true, exportFromIndex: false },
    { name: '@hey-api/sdk', responseStyle: 'data', exportFromIndex: false },
    { name: 'zod', definitions: { name: (name) => `${name}Schema` }, exportFromIndex: false }
  ]
});
```

**Kubb config** (62 lines with comments):
```typescript
export default defineConfig({
  root: '.',
  input: { path: './openapi.json' },
  output: { path: './src', clean: true, barrelType: 'all' },
  plugins: [
    pluginOas({ output: { path: './specs' }, discriminator: 'inherit' }),
    pluginTs({ output: { path: './types', barrelType: 'all' }, syntaxType: 'type' }),
    pluginZod({ output: { path: 'schemas', barrelType: 'all' }, version: '4' }),
    pluginClient({ client: 'fetch', bundle: true, output: { path: './api', barrelType: 'all' } }),
    pluginFaker({
      output: { path: './mocks', barrelType: 'all' },
      exclude: [/* workarounds for errors */]
    })
  ]
});
```

**Impact**: openapi-ts works great with minimal config. Kubb needs more tweaking and workarounds.

## What Kubb Does Better

### 1. Mock Data Generation ⭐

Kubb has `@kubb/plugin-faker` which generates mock data factories using Faker.js:

```typescript
import { createAccount } from './mocks/createAccount'

const mockAccount = createAccount()
// Returns realistic mock data for testing
```

**openapi-ts**: This feature is "coming soon" (not yet available)

### 2. More Plugin Ecosystem

Kubb has more plugins available:
- `@kubb/plugin-react-query` - React Query hooks
- `@kubb/plugin-swr` - SWR hooks  
- `@kubb/plugin-faker` - Mock data
- `@kubb/plugin-msw` - MSW handlers
- More community plugins

### 3. More Flexibility

Kubb's architecture allows for more customization if you need it, though this comes with complexity.

## Recommendations

### Use **openapi-ts** if you want:
- ✅ Clean, consolidated code (15 files vs 2000+)
- ✅ Valid TypeScript out of the box
- ✅ Minimal configuration
- ✅ Better type safety
- ✅ Quick setup

### Use **Kubb** if you need:
- ✅ Mock data generation (with Faker)
- ✅ More plugin options
- ✅ More flexibility/customization
- ⚠️ Can tolerate TypeScript errors to fix
- ⚠️ Okay with many files

### For this Linode API project:
The README conclusion is correct: **openapi-ts is the better choice** because:
1. Generates valid code (9 errors in tests vs 115+ in production code)
2. Cleaner structure (15 files vs 2000+ files)
3. Better developer experience
4. Works out of the box

**Once Kubb adds**:
- File consolidation
- Better error handling
- Valid code generation

**Then it would be competitive with openapi-ts**, especially with its mock data advantage.

## Improvements Made to Kubb

We've made these improvements to close the gap:

1. ✅ Changed `syntaxType` from `interface` to `type` (matches openapi-ts)
2. ✅ Added `barrelType: 'all'` for better consolidation
3. ✅ Updated package.json with proper exports (matches openapi-ts pattern)
4. ✅ Added comprehensive documentation

Still needed:
- ❌ Fix TypeScript errors (requires Kubb core fixes)
- ❌ True file consolidation (requires Kubb architecture change)
- ❌ Better defaults (requires Kubb core changes)

## See Also

- [COMPARISON.md](./COMPARISON.md) - Detailed technical comparison
- [packages/kubb/IMPROVEMENTS.md](./packages/kubb/IMPROVEMENTS.md) - Specific improvements made
- [README.md](./README.md) - Updated comparison table
