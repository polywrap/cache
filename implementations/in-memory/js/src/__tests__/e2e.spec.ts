import { PolywrapCoreClient } from "@polywrap/core-client-js";
import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { inMemoryCachePlugin } from "../";
import { Cache_Module } from "./types";

jest.setTimeout(10000);

describe("e2e", () => {
  let client: PolywrapCoreClient;
  const uri = "wrap://ens/wraps.eth:cache@1.0.0";

  beforeAll(() => {
    const config = new ClientConfigBuilder()
      .addPackage(uri, inMemoryCachePlugin({}))
      .build();
    client = new PolywrapCoreClient(config);
  });

  test("set", async () => {
    const setResult = await Cache_Module.set({ key: "a", value: new Uint8Array([1]) }, client);

    if (!setResult.ok) throw new Error(setResult.error?.toString());
    expect(setResult.value).toBeTruthy();

    const hasResult = await Cache_Module.has({ key: "a" }, client);

    if (!hasResult.ok) throw new Error(hasResult.error?.toString());
    expect(hasResult.value).toBeTruthy();

    const getResult = await Cache_Module.get({ key: "a" }, client);

    if (!getResult.ok) throw new Error(getResult.error?.toString());
    expect(getResult.value).toStrictEqual(new Uint8Array([1]));
  });

  test("delete", async () => {
    const setResult = await Cache_Module.set({ key: "a", value: new Uint8Array([1]) }, client);

    if (!setResult.ok) throw new Error(setResult.error?.toString());
    expect(setResult.value).toBeTruthy();

    const deleteResult = await Cache_Module.delete({ key: "a" }, client);

    if (!deleteResult.ok) throw new Error(deleteResult.error?.toString());
    expect(deleteResult.value).toBeTruthy();

    const hasResult = await Cache_Module.has({ key: "a" }, client);

    if (!hasResult.ok) throw new Error(hasResult.error?.toString());
    expect(hasResult.value).toBeFalsy();
  });
});
