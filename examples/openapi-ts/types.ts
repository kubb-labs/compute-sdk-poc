import type { GetLinodeInstanceResponse, Account } from '@akamai/openapi-ts'

// Types are perfect! 🎉
type Linode = GetLinodeInstanceResponse;
type LinodeSpecs = Linode['specs'];
