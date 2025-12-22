# Kubb Configuration Improvements

This document outlines the improvements made to the Kubb configuration to better match the code quality and structure of openapi-ts.

## Changes Made

### 1. Updated `kubb.config.ts`

#### Changed `syntaxType` from `interface` to `type`
```typescript
// Before
pluginTs({
  output: { path: './types' },
  syntaxType: 'interface',
})

// After
pluginTs({
  output: { path: './types', barrelType: 'all' },
  syntaxType: 'type',  // Matches openapi-ts style
})
```

**Reason**: Using `type` instead of `interface` provides:
- Better compatibility with openapi-ts
- More flexible type definitions
- Consistent with modern TypeScript practices

#### Added `barrelType: 'all'` to all plugins
```typescript
pluginTs({
  output: { path: './types', barrelType: 'all' },
  syntaxType: 'type',
})
```

**Reason**: Ensures all types are exported from index files for better consolidation and easier imports.

### 2. Updated `package.json`

#### Added `exports` field
```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.mts"
    },
    "./types": {
      "types": "./dist/types/index.ts"
    },
    "./schemas": {
      "import": "./dist/schemas/index.mjs",
      "types": "./dist/schemas/index.d.mts"
    },
    "./api": {
      "import": "./dist/api/index.mjs",
      "types": "./dist/api/index.d.mts"
    },
    "./mocks": {
      "import": "./dist/mocks/index.mjs",
      "types": "./dist/mocks/index.d.mts"
    }
  }
}
```

**Reason**: Provides better module resolution and matches the pattern used by openapi-ts:
- Users can import specific parts: `import type { Account } from '@akamai/kubb/types'`
- Users can import schemas: `import { accountSchema } from '@akamai/kubb/schemas'`
- Users can import API functions: `import { getAccount } from '@akamai/kubb/api'`
- Similar to openapi-ts exports pattern

#### Added `peerDependencies`
```json
{
  "peerDependencies": {
    "zod": "^4"
  }
}
```

**Reason**: Matches openapi-ts pattern and ensures users have the correct zod version installed.

## Remaining Issues to Address

### 1. TypeScript Errors (115+ errors)

The Kubb-generated code still has TypeScript errors that need to be addressed:

#### Missing `@faker-js/faker` imports
- **Issue**: Mock files import `@faker-js/faker` but it's not properly resolved
- **Solution**: Either move to devDependencies with proper types, or make mocks optional

#### Duplicate exports
- **Issue**: `GetMaintenance200` is exported multiple times
- **Current workaround**: Excluded in configuration
- **Better solution**: Kubb should handle this automatically

#### Complex filter types
- **Issue**: Some generated types have complex union/intersection issues
- **Solution**: Needs investigation in Kubb type generation

#### Missing FormData type
- **Issue**: `postTicketAttachment` uses FormData without proper import
- **Solution**: Add proper DOM types or FormData polyfill

### 2. File Consolidation

While we've improved the configuration, Kubb still generates many individual files (2000+) vs openapi-ts which generates ~15 consolidated files.

**Current structure:**
```
src/
  types/
    Account.ts
    AccountSettings.ts
    ...2000+ more files
  api/
    getAccount.ts
    putAccount.ts
    ...2000+ more files
  schemas/
    accountSchema.ts
    ...2000+ more files
```

**Desired structure (like openapi-ts):**
```
src/
  types.gen.ts       # All types in one file
  sdk.gen.ts         # All SDK functions in one file
  zod.gen.ts         # All schemas in one file
  client.gen.ts      # Client configuration
  index.ts           # Main exports
```

**Limitation**: Kubb's current architecture doesn't support true file consolidation like openapi-ts. The `bundle: true` option bundles functions but still creates separate files.

### 3. Code Quality Improvements Needed

To match openapi-ts code quality:

1. **Better type generation**: Use more advanced TypeScript features
2. **Error handling**: Ensure generated code is error-free
3. **Client integration**: Better client/SDK function integration
4. **Documentation**: Add JSDoc comments to match openapi-ts

## Workarounds

Until Kubb adds better consolidation support, we can:

1. **Use barrel exports**: The `barrelType: 'all'` configuration creates index files that re-export everything
2. **Build-time bundling**: Use tsdown or rollup to bundle the output
3. **Post-processing**: Create a script to consolidate generated files

## Recommendations for Kubb Project

If contributing back to Kubb, consider:

1. **Add consolidation mode**: New option to generate single files like openapi-ts
2. **Improve error handling**: Ensure generated code is TypeScript-valid
3. **Better defaults**: Make the tool work better out of the box
4. **Optional plugins**: Make faker plugin truly optional with proper feature flags
5. **Type generation improvements**: Use `type` as default instead of `interface`

## Comparison with openapi-ts

| Aspect | openapi-ts | Kubb (after improvements) |
|--------|-----------|---------------------------|
| File count | ~15 files | 2000+ files |
| TypeScript errors | 9 (in tests) | 115+ (in generated code) |
| Type syntax | `type` | `type` (now matches) ✅ |
| Exports structure | Clean subpath exports | Clean subpath exports ✅ |
| Mock data | ❌ | ✅ |
| Configuration complexity | Low | Medium |
| Plugin ecosystem | Smaller | Larger ✅ |

## Next Steps

1. Test the updated configuration by regenerating code
2. Count and categorize remaining TypeScript errors
3. Consider creating a custom Kubb plugin for better consolidation
4. Investigate making the faker plugin optional
5. Document best practices for using Kubb with large APIs
