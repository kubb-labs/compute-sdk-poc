const OPEN_API_SPEC_URL = 'https://raw.githubusercontent.com/linode/linode-api-docs/refs/heads/development/openapi.json';

const response = await fetch(OPEN_API_SPEC_URL);

await Bun.write('./openapi.json', response);

export { };
