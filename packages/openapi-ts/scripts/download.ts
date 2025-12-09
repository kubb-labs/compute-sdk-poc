import { OpenAPIV3_1 } from "openapi-types";
import { propertiesRequiredByDefaultTransform } from "./transform";

const OPEN_API_SPEC_URL = 'https://raw.githubusercontent.com/linode/linode-api-docs/refs/heads/development/openapi.json';

const response = await fetch(OPEN_API_SPEC_URL);

const spec = await response.json() as OpenAPIV3_1.Document;

if (spec.servers) {
  spec.servers[0].url = 'https://api.linode.com/v4/';
}

for (const path in spec.paths) {
  const pathItem = spec.paths[path];
  const oldPath = path;
  const newPath = path.replace('/{apiVersion}', '');
  spec.paths[newPath] = pathItem;
  delete spec.paths[oldPath];
  if (spec.paths[newPath]?.parameters) {
    spec.paths[newPath].parameters = spec.paths[newPath].parameters.filter((param) => 'name' in param && param.name !== 'apiVersion');
  }
}

propertiesRequiredByDefaultTransform({ spec });

await Bun.write('./openapi.json', JSON.stringify(spec, null, 2));

export { };
