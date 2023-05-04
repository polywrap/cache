# in-memory-cache-plugin-js
The in-memory-cache-plugin-js is a software module that allows caching binary data by string key in memory.

## Installation
To install the in-memory-cache-plugin-js, follow these steps:

1. Install the `@polywrap/core-client-js` and `@polywrap/client-config-builder-js` packages using yarn package manager.

2. Install the in-memory-cache-plugin-js by running the following command:
   ```
   yarn add @polywrap/in-memory-cache-plugin-js
   ```

   If you are using npm, run the following command instead:
   ```
   npm install @polywrap/in-memory-cache-plugin-js
   ```

## Usage
To use the in-memory-cache-plugin-js, you need to add it to your PolywrapCoreClient configuration using the ClientConfigBuilder. Here is an example:

```js
import { PolywrapCoreClient } from "@polywrap/core-client-js";
import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { inMemoryCachePlugin } from "@polywrap/in-memory-cache-plugin-js";

// Create the client configuration
const config = new ClientConfigBuilder()
  .addPackage("wrap://ens/wraps.eth:cache@1.0.0", inMemoryCachePlugin({}))
  .build();

// Create the client instance
const client = new PolywrapCoreClient(config);

// Use the client instance to interact with the cache module
// ...

// Get key using invocation
const result = await client.invoke({
  uri: "wrap://ens/wraps.eth:cache@1.0.0",
  method: "get",
  args: {
    key: "animal"
  }
})
```

## App Codegen API
The in-memory-cache-plugin-js provides the following API:

### set
Sets a value in the cache using a key. Returns a Promise that resolves to a boolean indicating whether the value was set successfully.

```
Cache_Module.set({ key: string, value: Uint8Array }, client: PolywrapCoreClient): Promise<Result<boolean, Error>>;
```

### get
Gets a value from the cache using a key. Returns a Promise that resolves to a Uint8Array containing the value, or null if the key is not found.

```
Cache_Module.get({ key: string }, client: PolywrapCoreClient): Promise<Result<Uint8Array | null, Error>>;
```

### has
Checks if a key exists in the cache. Returns a Promise that resolves to a boolean indicating whether the key exists.

```
Cache_Module.has({ key: string }, client: PolywrapCoreClient): Promise<Result<boolean, Error>>;
```

### delete
Deletes a value from the cache using a key. Returns a Promise that resolves to a boolean indicating whether the value was deleted successfully.

```
Cache_Module.delete({ key: string }, client: PolywrapCoreClient): Promise<Result<boolean, Error>>;
```

## Development Environment Setup
To set up the development environment for the in-memory-cache-plugin-js, follow these steps:

1. Clone the [polywrap/cache](github.com/polywrap/cache) repository from Github.
2. Install the required dependencies by running the following command:
   ```
   yarn install
   ```
3. Run the tests using the following command:
   ```
   yarn test
   ```

## Contributing
We welcome contributions to the in-memory-cache-plugin-js. To contribute, follow these steps:

1. Fork the [polywrap/cache](github.com/polywrap/cache) repository from Github.
2. Clone the forked repository to your local machine.
3. Create a new branch for your changes.
4. Make your changes and commit them with a descriptive message.
5. Push your changes to your forked repository.
6. Create a pull request to merge your changes into the main repository.

