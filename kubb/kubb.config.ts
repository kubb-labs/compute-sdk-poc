import { defineConfig } from '@kubb/core'
import { pluginClient } from '@kubb/plugin-client';
import { pluginOas } from '@kubb/plugin-oas';
import { pluginFaker } from '@kubb/plugin-faker';
import { pluginTs } from '@kubb/plugin-ts';
import { pluginZod } from '@kubb/plugin-zod';

export default defineConfig({
  root: '.',
  input: {
    path: './openapi.json',
  },
  output: {
    path: './src',
    clean: true,
    barrelType: 'all',
  },
  plugins: [
    pluginOas({
      output: {
        path: './specs'
      },
      discriminator: 'inherit',
    }),
    pluginTs({
      output: {
        path: './types'
      },
      syntaxType: 'interface',
    }),
    pluginZod({
      output: {
        path: 'schemas',
      },
      version: '4',
    }),
    pluginClient({
      client: 'fetch',
      output: {
        path: './api'
      },
    }),
    pluginFaker({
      output: {
        path: './mocks',
        barrelType: 'all'
      },
      exclude: [
        { pattern: 'get-maintenance-200', type: 'operationId' },
        { pattern: 'get-maintenance', type: 'operationId' },
        { pattern: '/{apiVersion}/account/maintenance', type: 'path' }
      ]
    }),
  ],
});
