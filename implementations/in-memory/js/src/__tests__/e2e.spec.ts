import { PolywrapCoreClient } from "@polywrap/core-client-js";
import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { inMemoryCachePlugin, InMemoryCachePluginConfig } from "../";
import { Cache_Module } from "./types";

jest.setTimeout(10000);

// Helper function to create clients with different configurations
function createClient(config: InMemoryCachePluginConfig): PolywrapCoreClient {
  const uri = "wrap://ens/wraps.eth:cache@1.0.0";
  const pluginConfig = new ClientConfigBuilder()
    .addPackage(uri, inMemoryCachePlugin(config))
    .build();
  return new PolywrapCoreClient(pluginConfig);
}

// Test case group 1: Cache hit and miss scenarios
describe("cache hit and miss scenarios", () => {
  let client: PolywrapCoreClient;

  beforeEach(() => {
    client = createClient({ size: 5, defaultTimeout: 5 });
  });

  test("cache hit", async () => {
    // Set an item in the cache
    const setResult = await Cache_Module.set({ key: "a", value: new Uint8Array([1]) }, client);
    if (!setResult.ok) throw new Error(setResult.error?.toString());
    expect(setResult.value).toBeTruthy();
  
    // Retrieve the item from the cache
    const getResult = await Cache_Module.get({ key: "a" }, client);
    if (!getResult.ok) throw new Error(getResult.error?.toString());
  
    // Check that the item is present and the value matches
    expect(getResult.value).toStrictEqual(new Uint8Array([1]));
  });
  

  test("cache miss", async () => {
    // Delete any existing item with key "a"
    await Cache_Module.delete({ key: "a" }, client);
  
    // Try to retrieve a non-existent item from the cache
    const getResult = await Cache_Module.get({ key: "a" }, client);
    if (!getResult.ok) throw new Error(getResult.error?.toString());
  
    // Check that the item is not present
    expect(getResult.value).toBeNull();
  });
  
});

// Test case group 2: Item expiration
describe("item expiration", () => {
  let client: PolywrapCoreClient;

  beforeEach(() => {
    client = createClient({ size: 2 });
  });

  test("item expires after timeout", async () => {
    // Set an item with key "a" and a timeout of 1 second (1000 ms)
    const setResult = await Cache_Module.set({ key: "a", value: new Uint8Array([1]), timeout: 1 }, client);
    if (!setResult.ok) throw new Error(setResult.error?.toString());
    expect(setResult.value).toBeTruthy();
  
    // Wait for 1.1 seconds (1100 ms) to ensure the item has expired
    await new Promise((resolve) => setTimeout(resolve, 1100));
  
    // Try to retrieve the expired item
    const getResult = await Cache_Module.get({ key: "a" }, client);
    if (!getResult.ok) throw new Error(getResult.error?.toString());
  
    // Check that the item is not present (expired)
    expect(getResult.value).toBeNull();
  });  

  test("LRU eviction policy", async () => {
    // Set three items: A, B, and C
    await Cache_Module.set({ key: "A", value: new Uint8Array([1]) }, client);
    await Cache_Module.set({ key: "B", value: new Uint8Array([2]) }, client);
    await Cache_Module.set({ key: "C", value: new Uint8Array([3]) }, client);
  
    // Check if item A is evicted (cache miss)
    const getResultA = await Cache_Module.get({ key: "A" }, client);
    if (!getResultA.ok) throw new Error(getResultA.error?.toString());
    expect(getResultA.value).toBeNull();
  
    // Check if item B and C are still in cache (cache hit)
    const getResultB = await Cache_Module.get({ key: "B" }, client);
    if (!getResultB.ok) throw new Error(getResultB.error?.toString());
    expect(getResultB.value).toStrictEqual(new Uint8Array([2]));
  
    const getResultC = await Cache_Module.get({ key: "C" }, client);
    if (!getResultC.ok) throw new Error(getResultC.error?.toString());
    expect(getResultC.value).toStrictEqual(new Uint8Array([3]));
  });
  
});

// Test case group 3: Overwriting values
describe("overwriting values", () => {
  let client: PolywrapCoreClient;

  beforeEach(() => {
    client = createClient({ size: 5, defaultTimeout: 5 });
  });

  test("overwrite value with set method", async () => {
    // Set an item with key "a" and value [1]
    const initialSetResult = await Cache_Module.set({ key: "a", value: new Uint8Array([1]) }, client);
    if (!initialSetResult.ok) throw new Error(initialSetResult.error?.toString());
    expect(initialSetResult.value).toBeTruthy();
  
    // Overwrite the item with key "a" and a new value [2]
    const overwriteSetResult = await Cache_Module.set({ key: "a", value: new Uint8Array([2]) }, client);
    if (!overwriteSetResult.ok) throw new Error(overwriteSetResult.error?.toString());
    expect(overwriteSetResult.value).toBeTruthy();
  
    // Retrieve the item with key "a"
    const getResult = await Cache_Module.get({ key: "a" }, client);
    if (!getResult.ok) throw new Error(getResult.error?.toString());
  
    // Check that the item's value is the new value [2]
    expect(getResult.value).toStrictEqual(new Uint8Array([2]));
  });

  test("add item without overwriting existing item", async () => {
    // Set an item with key "a" and value [1]
    const initialSetResult = await Cache_Module.set({ key: "a", value: new Uint8Array([1]) }, client);
    if (!initialSetResult.ok) throw new Error(initialSetResult.error?.toString());
    expect(initialSetResult.value).toBeTruthy();
  
    // Overwrite the item with key "a" and a new value [2]
    const addResult = await Cache_Module.add({ key: "a", value: new Uint8Array([2]) }, client);
    if (!addResult.ok) throw new Error(addResult.error?.toString());
    expect(addResult.value).toBeFalsy();
  
    // Retrieve the item with key "a"
    const getResult = await Cache_Module.get({ key: "a" }, client);
    if (!getResult.ok) throw new Error(getResult.error?.toString());
  
    // Check that the item's value is the original value [1]
    expect(getResult.value).toStrictEqual(new Uint8Array([1]));
  });
  
});

// Test case group 4: Deleting items
describe("deleting items", () => {
  let client: PolywrapCoreClient;

  beforeEach(() => {
    client = createClient({ size: 5, defaultTimeout: 5 });
  });

  test("delete item", async () => {
    // Set an item with key "a" and value [1]
    const setResult = await Cache_Module.set({ key: "a", value: new Uint8Array([1]) }, client);
    if (!setResult.ok) throw new Error(setResult.error?.toString());
    expect(setResult.value).toBeTruthy();
  
    // Delete the item with key "a"
    const deleteResult = await Cache_Module.delete({ key: "a" }, client);
    if (!deleteResult.ok) throw new Error(deleteResult.error?.toString());
    expect(deleteResult.value).toBeTruthy();
  
    // Retrieve the item with key "a"
    const getResult = await Cache_Module.get({ key: "a" }, client);
    if (!getResult.ok) throw new Error(getResult.error?.toString());
  
    // Check that the item is not present
    expect(getResult.value).toBeNull();
  });

  test("delete non-existent item", async () => {
    // Delete the item with key "a"
    const deleteResult = await Cache_Module.delete({ key: "a" }, client);
    if (!deleteResult.ok) throw new Error(deleteResult.error?.toString());
    expect(deleteResult.value).toBeFalsy();
  });

  test("clear cache", async () => {
    // Set an item with key "a" and value [1]
    const setResult = await Cache_Module.set({ key: "a", value: new Uint8Array([1]) }, client);
    if (!setResult.ok) throw new Error(setResult.error?.toString());
    expect(setResult.value).toBeTruthy();
  
    // Set an item with key "b" and value [2]
    const setResult2 = await Cache_Module.set({ key: "b", value: new Uint8Array([2]) }, client);
    if (!setResult2.ok) throw new Error(setResult2.error?.toString());
    expect(setResult2.value).toBeTruthy();
  
    // Clear the cache
    const clearResult = await Cache_Module.clear({}, client);
    if (!clearResult.ok) throw new Error(clearResult.error?.toString());
    expect(clearResult.value).toBeTruthy();
  
    // Retrieve the item with key "a"
    const getResult = await Cache_Module.get({ key: "a" }, client);
    if (!getResult.ok) throw new Error(getResult.error?.toString());
  
    // Check that the item is not present
    expect(getResult.value).toBeNull();
  
    // Retrieve the item with key "b"
    const getResult2 = await Cache_Module.get({ key: "b" }, client);
    if (!getResult2.ok) throw new Error(getResult2.error?.toString());
  
    // Check that the item is not present
    expect(getResult2.value).toBeNull();
  });
});

// Test case group 5: Retrieving keys
describe("retrieving keys", () => {
  let client: PolywrapCoreClient;

  beforeEach(() => {
    client = createClient({ size: 5, defaultTimeout: 5 });
  });

  test("retrieve keys", async () => {
    // Set an item with key "a" and value [1]
    const setResult = await Cache_Module.set({ key: "a", value: new Uint8Array([1]) }, client);
    if (!setResult.ok) throw new Error(setResult.error?.toString());
    expect(setResult.value).toBeTruthy();
  
    // Set an item with key "b" and value [2]
    const setResult2 = await Cache_Module.set({ key: "b", value: new Uint8Array([2]) }, client);
    if (!setResult2.ok) throw new Error(setResult2.error?.toString());
    expect(setResult2.value).toBeTruthy();
  
    // Retrieve the keys
    const keysResult = await Cache_Module.keys({}, client);
    if (!keysResult.ok) throw new Error(keysResult.error?.toString());
  
    // Check that the keys are correct
    expect(keysResult.value).toStrictEqual(["a", "b"]);
  });
});
