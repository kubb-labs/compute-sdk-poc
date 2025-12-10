import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './openapi.json',
  output: 'src',
  plugins: [
    {
      name: '@hey-api/client-fetch',
      throwOnError: true,
      exportFromIndex: false,
    },
    {
      name: '@hey-api/sdk',
      responseStyle: 'data',
      exportFromIndex: false,
    },
    {
      name: 'zod',
      definitions: { name: (name) => `${name}Schema` },
      requests: { name: (name) => `${name}RequestSchema` },
      responses: { name: (name) => `${name}ResponseSchema` },
      exportFromIndex: false,
    }
  ],
});
