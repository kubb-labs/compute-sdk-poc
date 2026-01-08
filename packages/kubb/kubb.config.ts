import { defineConfig } from '@kubb/core'
import { pluginClient } from '@kubb/plugin-client'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginFaker } from '@kubb/plugin-faker'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginZod } from '@kubb/plugin-zod'

export default defineConfig({
  root: '.',
  input: {
    path: './openapi.json',
  },
  output: {
    path: './src',
    clean: true,
    barrelType: 'named',
  },
  plugins: [
    pluginOas({
      output: {
        path: './specs',
      },
      discriminator: 'inherit',
    }),
    pluginTs({
      output: {
        path: './types.ts',
        barrelType: 'named',
      },
      enumType: 'inlineLiteral',
      arrayType: 'generic',
      syntaxType: 'interface',
    }),
    pluginZod({
      output: {
        path: 'schemas.ts',
        barrelType: 'named',
      },
      version: '4',
    }),
    pluginClient({
      client: 'fetch',
      bundle: true,
      output: {
        path: './api.ts',
        barrelType: 'named',
      },
    }),
    // pluginFaker({
    //   output: {
    //     path: './mocks',
    //     barrelType: 'all'
    //   },
    //   exclude: [
    //     { pattern: 'get-maintenance-200', type: 'operationId' },
    //     { pattern: 'get-maintenance', type: 'operationId' },
    //     { pattern: '/{apiVersion}/account/maintenance', type: 'path' }
    //   ]
    // }),
  ],
})
