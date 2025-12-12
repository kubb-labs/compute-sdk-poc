# Generating TypeScript SDKs from the Linode OpenAPI specification

This repo contains different attempts for generating TypeScript SDKs from the [Linode OpenAPI spesification](https://github.com/linode/linode-api-docs/blob/development/openapi.json) using different tools.

Each folder in the `packages` directory represents a different tool being used to generate a TypeScript SDK.
The `examples` directory is just used a manual playground for testing the generated SDKs.

## Tools Tested

### [Hey API](https://heyapi.dev/) 🥇

You can see API reference docs for this generated SDK [here](https://bnussman-akamai.github.io/compute-sdk-poc/types/types.gen.PostLinodeInstanceData.html)!

#### Pros
- Generated mostly valid code (5 errors in 2 files according to TypeScript) without any patches to the OpenAPI spec
  - I got it down to 0 errors by patching the OpenAPI spec
- Has good defaults
- Easy to configure

#### Cons
- Does not support generating mock data like Kubb yet
  - Claims to be coming soon https://github.com/hey-api/openapi-ts/issues/1485 

### [Kubb](https://kubb.dev/) 🥈

#### Pros
- More plugins in general
- Supports mock data tools like Faker which could be very useful for us

#### Cons
- Generated lots of invalid code (115 errors in 47 files according to TypeScript)
  - Have not tried patching yet to get this number down

<hr />

### Comparison Chart

This isn't comprehensive. It just highlights some key points between the tools. 

|                  |  [Hey](https://heyapi.dev/openapi-ts/core)  |  [Kubb](https://kubb.dev/plugins/core/)  |
|------------------|-------|--------|
| Fetch Client     |  ✅   |   ✅   |
| Axios Client     |  ✅   |   ✅   |
| Ky Client        |  ✅   |   ✅   |
| TypeScript types |  ✅   |   ✅   |
| Zod Schemas      |  ✅   |   ✅   |
| React Query hooks|  ✅   |   ✅   |
| Mock Data        |  ❌ (Coming soon)   |   ✅   |
| Angular support  |  ✅   |   ❌   |
| Generates valid code  |  ✅ (5 errors in 2 files according to TypeScript)  |   ❌  (115 errors in 47 files according to TypeScript)  |

## Conclusion

I had the most success with using https://heyapi.dev to generate a TypeScript SDK.

With minor patching to the source OpenAPI spec, it generates a feature-rich fetch client, valid Zod schemas, and valid TypeScript types. Most types and schemas seem correct, but some are inaccurate due to inaccuracy and flaws in the source OpenAPI specification.

<img src="https://github.com/user-attachments/assets/602154b2-39d2-44bd-b720-d8b6e5083f52" width="670px" />

You view [auto-generated reference docs](https://bnussman-akamai.github.io/compute-sdk-poc/functions/sdk.gen.postLinodeInstance.html) of the SDK to get an idea of what the final result is like.

For teams and/or apps that would like to generate their API calls and types from an OpenAPI specification, Hey API may be a great option as shown in this proof of concept.
Once Hey API supports [generating mock data](https://heyapi.dev/openapi-ts/plugins/faker) (similar to Linode Cloud Manager's [factories](https://github.com/linode/manager/tree/develop/packages/manager/src/factories)), using an auto-generated TypeScript SDK will be a very compelling option. 

<img src="https://github.com/user-attachments/assets/8c0edfeb-a667-43c1-86a7-ee43be81355d" width="670px" />

