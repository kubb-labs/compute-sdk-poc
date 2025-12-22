# Recommendations for Kubb SDK Generation

Based on the comparison with openapi-ts, here are specific recommendations for teams considering Kubb for SDK generation.

## When to Choose Kubb Over openapi-ts

Choose Kubb if you need:

1. **Mock Data Generation** - Kubb's `@kubb/plugin-faker` provides realistic mock data for testing
2. **More Plugin Options** - React Query, SWR, MSW handlers, etc.
3. **Granular File Control** - Some teams prefer individual files per operation
4. **Customization** - Need to customize code generation beyond what openapi-ts offers

## Configuration Best Practices

### 1. Use `type` instead of `interface`

```typescript
pluginTs({
  syntaxType: 'type',  // ✅ Better compatibility
  // syntaxType: 'interface',  // ❌ Less flexible
})
```

**Why**: TypeScript `type` aliases are more flexible and match openapi-ts style.

### 2. Enable Barrel Exports

```typescript
output: {
  path: './src',
  barrelType: 'all',  // ✅ Creates index.ts with all exports
}

pluginTs({
  output: {
    path: './types',
    barrelType: 'all',  // ✅ Enables easier imports
  },
})
```

**Why**: Makes imports cleaner: `import { Account } from './types'` instead of `import { Account } from './types/Account'`

### 3. Bundle Client Functions

```typescript
pluginClient({
  client: 'fetch',
  bundle: true,  // ✅ Bundles into fewer files
  output: {
    path: './api',
    barrelType: 'all',
  },
})
```

**Why**: Reduces file count and improves organization.

### 4. Exclude Problematic Operations

```typescript
pluginFaker({
  exclude: [
    { pattern: 'get-maintenance-200', type: 'operationId' },
    { pattern: 'get-maintenance', type: 'operationId' },
  ]
})
```

**Why**: Some OpenAPI specs have issues (duplicate operation IDs, etc.). Exclude them to avoid errors.

### 5. Set Up Proper Exports in package.json

```json
{
  "exports": {
    ".": "./dist/index.mjs",
    "./types": "./dist/types/index.ts",
    "./schemas": "./dist/schemas/index.mjs",
    "./api": "./dist/api/index.mjs",
    "./mocks": "./dist/mocks/index.mjs"
  },
  "peerDependencies": {
    "zod": "^4"
  }
}
```

**Why**: Provides better module resolution and matches modern package standards.

## Known Issues and Workarounds

### Issue 1: Too Many Files

**Problem**: Kubb generates 2000+ files for large APIs

**Impact**: 
- Harder to navigate
- Slower IDE performance
- Larger bundle sizes (without tree-shaking)

**Workarounds**:
1. Use `barrelType: 'all'` to create index files
2. Use build tools (rollup/esbuild) to bundle further
3. Accept the trade-off for granular control

**Long-term**: Request file consolidation feature from Kubb maintainers

### Issue 2: TypeScript Errors in Generated Code

**Problem**: Missing imports, duplicate exports, type issues

**Impact**: Code doesn't compile without manual fixes

**Workarounds**:
1. Exclude problematic operations (like GetMaintenance200)
2. Move faker to devDependencies
3. Add post-generation script to fix common issues
4. Manually fix remaining errors

**Long-term**: Report issues to Kubb GitHub repository

### Issue 3: Missing FormData Types

**Problem**: Operations with file uploads use FormData without proper types

**Workarounds**:
1. Add `"lib": ["DOM"]` to tsconfig.json
2. Or install `@types/node` for FormData polyfill

### Issue 4: Complex Filter Types

**Problem**: Some operations generate complex union/intersection types that break

**Workarounds**:
1. Exclude specific problematic operations
2. Manually simplify types after generation
3. Report to Kubb for better type generation

## Migration from openapi-ts to Kubb

If you need Kubb's features (like mock data) but currently use openapi-ts:

### Migration Steps

1. **Keep openapi-ts for production code**
   ```json
   {
     "scripts": {
       "generate:sdk": "openapi-ts",
       "generate:mocks": "kubb generate"
     }
   }
   ```

2. **Use Kubb only for mocks**
   - Configure Kubb to generate only mocks
   - Keep using openapi-ts for types, schemas, and SDK

3. **Gradually migrate**
   - Start with types (safest)
   - Then schemas (if needed)
   - Finally SDK functions (most complex)

### Example: Mocks-Only Kubb Config

```typescript
export default defineConfig({
  input: { path: './openapi.json' },
  output: { path: './src/mocks', clean: true },
  plugins: [
    pluginOas({ output: { path: './specs' } }),
    pluginTs({ output: { path: './types' } }),  // Needed for mocks
    pluginFaker({ output: { path: './' } }),    // Only generate mocks
  ],
});
```

## Testing Generated Code

### 1. TypeScript Compilation

```bash
npm run typecheck
```

**Expected**: Ideally 0 errors, but currently 115+ with Kubb

**Action**: Document all errors and create workarounds

### 2. Runtime Testing

```typescript
import { getAccount } from './api'

// Test the generated SDK
const result = await getAccount({
  baseURL: 'https://api.example.com'
})
```

### 3. Mock Data Testing

```typescript
import { createAccount } from './mocks'

// Test mock generation
const mockData = createAccount()
expect(mockData).toHaveProperty('email')
```

## Performance Considerations

### Build Time

- **openapi-ts**: ~5-10 seconds for large APIs
- **Kubb**: ~10-20 seconds (generates more files)

### IDE Performance

- **openapi-ts**: Better (fewer files to index)
- **Kubb**: Slower with 2000+ files

### Bundle Size (without tree-shaking)

- **openapi-ts**: Smaller (consolidated files)
- **Kubb**: Larger (many files, duplicate imports)

### Bundle Size (with tree-shaking)

- Both: Similar (only used code is included)

## Contributing Back to Kubb

If you implement workarounds or fixes, consider contributing to Kubb:

### Areas for Contribution

1. **File consolidation plugin** - Create a plugin that merges generated files
2. **Better type generation** - Fix complex type issues
3. **Error handling** - Ensure valid TypeScript generation
4. **Documentation** - Add more examples and best practices
5. **Testing** - Add tests for edge cases in OpenAPI specs

### How to Contribute

1. Fork Kubb repository
2. Create issue describing the problem
3. Submit PR with fix
4. Add tests for your changes
5. Update documentation

## Future Outlook

### When Kubb Catches Up

If Kubb implements:
- File consolidation (single types.ts, sdk.ts, schemas.ts)
- Error-free code generation
- Better defaults

Then it would be superior to openapi-ts due to:
- Mock data generation
- More plugin ecosystem
- More flexibility

### Estimated Timeline

Based on current development pace:
- File consolidation: 6-12 months
- Error-free generation: 3-6 months
- Better defaults: 3-6 months

### What to Watch

- Kubb GitHub issues and PRs
- Plugin ecosystem growth
- Community adoption and feedback

## Final Recommendation

**For Production Use Today:**
- Use **openapi-ts** for cleaner, error-free code
- Consider **Kubb** only if you absolutely need mock data or specific plugins
- Be prepared to fix TypeScript errors if using Kubb

**For Experimentation:**
- Try **Kubb** to explore its plugin ecosystem
- Contribute fixes back to the community
- Help shape its future development

**For This Linode Project:**
- Stick with **openapi-ts** (as README concludes)
- Wait for Kubb to mature before reconsidering
- Use the comparison docs to guide future evaluations
