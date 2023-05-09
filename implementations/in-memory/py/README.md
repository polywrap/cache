# polywrap-in-memory-cache-plugin
The polywrap-in-memory-cache-plugin is a software module that allows caching binary data by string key in memory.

## Installation
To install the in-memory-cache-plugin-js, follow these steps:

1. Install the `polywrap-client` and `polywrap-client-config-builder` packages using pypi package manager.

2. Install the polywrap-in-memory-cache-plugin by running the following command:
   ```
   pip install polywrap-in-memory-cache-plugin
   ```

## Usage
To use the polywrap-in-memory-cache-plugin, you need to add it to your PolywrapCoreClient configuration using the PolywrapClientConfigBuilder. Here is an example:

```python
from polywrap_client import PolywrapClient
from polywrap_core import Uri, InvokerOptions
from polywrap_client_config_builder import PolywrapClientConfigBuilder
from polywrap_in_memory_cache_plugin import inMemoryCachePlugin

# Create the client configuration
config = ClientConfigBuilder()
    .addPackage("wrap://ens/wraps.eth:cache@1.0.0", inMemoryCachePlugin({}))
    .build()

# Create the client instance
client = PolywrapClient(config)

# Use the client instance to interact with the cache module
# ...

# Get key using invocation
result = await client.invoke(
    InvokerOptions(
        uri=Uri.from_str("wrap://ens/wraps.eth:cache@1.0.0"),
        method="get",
        args={
            "key": "animal"
        }
    )
)

```

## Development Environment Setup
To set up the development environment for the in-memory-cache-plugin-js, follow these steps:

1. Clone the [polywrap/cache](github.com/polywrap/cache) repository from Github.
2. Install the required dependencies by running the following command:
   ```
   yarn install
   ```
3. Generate the types and interfaces by running the following command:
    ```
    yarn codegen
    ```
4. Install the python dependencies:
    ```
    poetry install
    ```
5. Run the tests using the following command:
   ```
   poetry run tox
   ```

## Contributing
We welcome contributions to the in-memory-cache-plugin-js. To contribute, follow these steps:

1. Fork the [polywrap/cache](github.com/polywrap/cache) repository from Github.
2. Clone the forked repository to your local machine.
3. Create a new branch for your changes.
4. Make your changes and commit them with a descriptive message.
5. Push your changes to your forked repository.
6. Create a pull request to merge your changes into the main repository.

