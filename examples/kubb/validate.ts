import { postLinodeInstanceMutationRequestSchema } from '@akamai/kubb'

const linodePayload = postLinodeInstanceMutationRequestSchema.parse({
  region: 'us-east',
  type: 'g6-standard-1',
})

console.log("Linode Payload:", linodePayload)

// This schema is working 🎉
