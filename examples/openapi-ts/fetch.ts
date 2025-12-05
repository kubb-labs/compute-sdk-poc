import { getLinodeInstance } from '@akamai/openapi-ts'
import { client } from "@akamai/openapi-ts/client";

client.setConfig({
  headers: {
    Authorization: `Bearer ${process.env.LINODE_API_TOKEN}`,
  },
})

const linode = await getLinodeInstance({ path: { linodeId: 123 }});

console.log("Linode Response:", linode)
