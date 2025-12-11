import { getLinodeInstance, setConfig } from '@akamai/kubb'

setConfig({
  baseURL: 'https://api.linode.com',
  headers: {
    Authorization: `Bearer ${process.env.LINODE_API_TOKEN}`,
  },
})

const linodeId = 1;

const linode = await getLinodeInstance(linodeId);

console.log("Linode Response:", linode)
