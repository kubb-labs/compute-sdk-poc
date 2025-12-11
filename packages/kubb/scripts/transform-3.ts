import { OpenAPIV3_1 } from "openapi-types";

export function moveApiVersionToServerUrl({ spec }: { spec: OpenAPIV3_1.Document }) {
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
}
