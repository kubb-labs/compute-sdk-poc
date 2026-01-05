import { describe, expect, expectTypeOf, test } from "vitest";
import { getLinodeInstance, postLinodeInstance } from "../src/sdk.gen";
import { http, HttpResponse } from 'msw'
import { server } from "./msw";
import { postLinodeInstanceRequestSchema } from "../src/zod.gen";

describe("TypeScript types", () => {
  test("payload for creating a Linode", () => {
    expectTypeOf(postLinodeInstance).toBeFunction();
    expectTypeOf(postLinodeInstance).parameter(0).toExtend<{ body: { region: string, type: string, image?: string | null, tags?: string[] } }>();
  });

  test("path params for fetching a Linode", () => {
    expectTypeOf(getLinodeInstance).toBeFunction();
    expectTypeOf(getLinodeInstance).parameter(0).toExtend<{ path: { linodeId: number } }>();
  });


  test("return type when fetching a Linode", async () => {
    const mockLinode = { id: 1, label: 'linode-1' };

    server.use(
      http.get('https://api.linode.com/v4/linode/instances/:id', () => {
        return HttpResponse.json(mockLinode);
      })
    )

    const linode = await getLinodeInstance({ path: { linodeId: 1 } });

    expect(linode).toStrictEqual(mockLinode);
    expectTypeOf(linode).toExtend<{ id: number, label: string }>();
  });

  test("can override the base URL", async() => {
    getLinodeInstance({
      baseUrl: 'https://api.linode.com/v4beta',
      path: {
        linodeId: 0
      }
    })
  });
});


describe("Validation Schemas", () => {
  test("should not throw if all required params as passed", () => {
    const payload = { region: 'us-east', type: 'g6-standard-1' };

    expect(() => postLinodeInstanceRequestSchema.shape.body.parse(payload)).not.toThrow();
  });

  test("should throw if required params are missing", () => {
    const payload = { type: 'g6-standard-1' };

    const { error } = postLinodeInstanceRequestSchema.shape.body.safeParse(payload);

    expect(error).toBeDefined();

    const regionFieldError = error?.issues.find(issue => issue.path[0] === 'region');

    expect(regionFieldError).toBeDefined();

    expect(regionFieldError?.message).toBe('Invalid input: expected string, received undefined');

    // Region is the only other required field
    expect(error?.issues).toHaveLength(1);
  });
});
