import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './openapi.json',
  output: 'src',
  parser: {
    transforms: {
      propertiesRequiredByDefault: true,
    },
  },
  plugins: [
    {
      name: '@hey-api/client-fetch',
      throwOnError: true,
    },
    {
      name: '@hey-api/sdk',
      responseStyle: 'data',
      // paramsStructure: 'flat',
    },
    {
      name: 'zod',
      definitions: { name: (name) => `${name}Schema` },
      requests: { name: (name) => `${name}RequestSchema` },
      responses: { name: (name) => `${name}ResponseSchema` }
    }
  ],
});
