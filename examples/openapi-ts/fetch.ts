import { getLinodeInstance, getLinodeInstances, postFirewallDevice } from '@akamai/openapi-ts/sdk'
import { client } from "@akamai/openapi-ts/client";

client.setConfig({
  headers: {
    Authorization: `Bearer ${process.env.LINODE_API_TOKEN}`,
  },
})

const linode = await getLinodeInstance({ path: { linodeId: 123 }});

console.log("Linode Response:", linode)

const linodes = await getLinodeInstances({ query: { page: 1, page_size: 125 } });

console.log("Linodes Response:", linodes.data)

await postFirewallDevice({ body: { type: 'linode_interface', id: 0 }, path: { firewallId: 456 } });
