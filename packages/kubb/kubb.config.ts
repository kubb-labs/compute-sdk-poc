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
    // Export everything from index for better consolidation
    barrelType: 'all',
  },
  plugins: [
    pluginOas({
      output: {
        path: './specs'
      },
      discriminator: 'inherit',
    }),
    // Generate types using 'type' instead of 'interface' for better compatibility
    pluginTs({
      output: {
        path: './types',
        // Consolidate types into fewer files
        barrelType: 'all',
      },
      // Use 'type' instead of 'interface' to match openapi-ts style
      syntaxType: 'type',
    }),
    // Generate Zod schemas
    pluginZod({
      output: {
        path: 'schemas',
        // Consolidate schemas
        barrelType: 'all',
      },
      version: '4',
    }),
    // Generate client/SDK functions
    pluginClient({
      client: 'fetch',
      // Bundle client functions
      bundle: true,
      output: {
        path: './api',
        // Export client functions from barrel
        barrelType: 'all',
      },
    }),
    // Generate mock data factories (optional feature)
    pluginFaker({
      output: {
        path: './mocks',
        barrelType: 'all'
      },
      // Exclude problematic operations
      exclude: [
        { pattern: 'get-maintenance-200', type: 'operationId' },
        { pattern: 'get-maintenance', type: 'operationId' },
        { pattern: '/{apiVersion}/account/maintenance', type: 'path' }
      ]
    }),
  ],
});
