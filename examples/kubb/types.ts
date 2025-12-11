import type { GetLinodeInstance200, PostLinodeInstanceMutationRequest, XFilter } from '@akamai/kubb'

// These types are correct! 🎉

type Linode = GetLinodeInstance200;

type LinodeSpecs = Linode['specs'];

const linodePayload: PostLinodeInstanceMutationRequest = {
  label: 'my-new-linode',
  region: 'us-east',
  type: 'g6-nanode-1',
  interfaces: [
    {
      vpc: {
        subnet_id: 1,
        ipv4: {
          addresses: [
            { address: 'auto', primary: true, nat_1_1_address: 'auto' }
          ]
        }
      }
    }
  ],
};
