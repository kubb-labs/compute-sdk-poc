import { OpenAPIV3_1 } from "openapi-types";
import { propertiesRequiredByDefaultTransform } from "./transform";
import { fixNulls } from "./transform-2";
import { moveApiVersionToServerUrl } from "./transform-3";
import { removeBrokenSchemas } from "./transform-4";

const OPEN_API_SPEC_URL = 'https://raw.githubusercontent.com/linode/linode-api-docs/refs/heads/development/openapi.json';

const response = await fetch(OPEN_API_SPEC_URL);

const spec = await response.json() as OpenAPIV3_1.Document;

propertiesRequiredByDefaultTransform({ spec });
fixNulls({ spec });
moveApiVersionToServerUrl({ spec });
removeBrokenSchemas({ spec });

await Bun.write('./openapi.json', JSON.stringify(spec, null, 2));

export { };
