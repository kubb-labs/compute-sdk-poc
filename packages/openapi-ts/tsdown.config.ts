import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/zod.gen.ts', './src/client.gen.ts', './src/sdk.gen.ts'],
  dts: true
})
