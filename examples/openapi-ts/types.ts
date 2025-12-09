import type { GetLinodeInstanceResponse, Account, PostLinodeInstanceData } from '@akamai/openapi-ts'

type Linode = GetLinodeInstanceResponse;
type LinodeSpecs = Linode['specs'];

type CreateLinodePayload = PostLinodeInstanceData['body'];

const payload: CreateLinodePayload = {
  region: 'us-east',
  type: 'g6-standard-1'
};
