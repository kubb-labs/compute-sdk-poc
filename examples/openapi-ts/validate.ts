import { postLinodeInstanceRequestSchema } from '@akamai/openapi-ts/zod'

const linodePayload = postLinodeInstanceRequestSchema.shape.body.parse({
  region: 'us-east',
  type: 'g6-standard-1',
})

console.log("Linode Payload:", linodePayload)
