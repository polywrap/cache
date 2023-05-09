# conftest.py
from typing import Any
import pytest

from datetime import timedelta
from polywrap_client import InvokerOptions
from polywrap_core import Uri
from freezegun import freeze_time
from polywrap_client import PolywrapClient
from polywrap_core import Uri, WrapPackage, UriPackageOrWrapper
from polywrap_uri_resolvers import FsUriResolver, SimpleFileReader
from polywrap_client_config_builder import PolywrapClientConfigBuilder
from polywrap_in_memory_cache_plugin import in_memory_cache_plugin, CacheConfig


@pytest.fixture(
    params=[
        CacheConfig(size=5, default_timeout=None),
        CacheConfig(size=None, default_timeout=5),
        CacheConfig(size=5, default_timeout=5),
        CacheConfig(size=None, default_timeout=None),
    ]
)
def cache_plugin(request: Any):
    config = request.param
    plugin = in_memory_cache_plugin(config)
    setattr(plugin, "config", config)
    return plugin


@pytest.fixture
def builder(cache_plugin: WrapPackage[UriPackageOrWrapper]):
    return (
        PolywrapClientConfigBuilder()
        .add_resolver(FsUriResolver(file_reader=SimpleFileReader()))
        .set_package(Uri.from_str("plugin/cache"), cache_plugin)
    )


@pytest.fixture
def client(builder: PolywrapClientConfigBuilder):
    config = builder.build()
    return PolywrapClient(config)


@pytest.mark.parametrize(
    "config",
    [
        CacheConfig(size=3, default_timeout=5),
        CacheConfig(size=3, default_timeout=None),
        CacheConfig(size=None, default_timeout=5),
        CacheConfig(size=None, default_timeout=None),
    ],
)
async def test_custom_cache_configurations(config: CacheConfig):
    plugin = in_memory_cache_plugin(config)
    client = PolywrapClient(
        PolywrapClientConfigBuilder()
        .set_package(Uri.from_str("plugin/cache"), plugin)
        .build()
    )

    with freeze_time("2022-01-01 12:00:00") as frozen_time:
        # Test add operation
        await client.invoke(
            InvokerOptions(
                uri=Uri.from_str("plugin/cache"),
                method="add",
                args={"key": "key1", "value": b"value1", "timeout": None},
            )
        )
        await client.invoke(
            InvokerOptions(
                uri=Uri.from_str("plugin/cache"),
                method="add",
                args={"key": "key2", "value": b"value2", "timeout": None},
            )
        )
        await client.invoke(
            InvokerOptions(
                uri=Uri.from_str("plugin/cache"),
                method="add",
                args={"key": "key3", "value": b"value3", "timeout": None},
            )
        )

        # Test get operation
        assert (
            await client.invoke(
                InvokerOptions(
                    uri=Uri.from_str("plugin/cache"), method="get", args={"key": "key1"}
                )
            )
            == b"value1"
        )
        assert (
            await client.invoke(
                InvokerOptions(
                    uri=Uri.from_str("plugin/cache"), method="get", args={"key": "key2"}
                )
            )
            == b"value2"
        )
        assert (
            await client.invoke(
                InvokerOptions(
                    uri=Uri.from_str("plugin/cache"), method="get", args={"key": "key3"}
                )
            )
            == b"value3"
        )

        # Add a new item to the cache
        await client.invoke(
            InvokerOptions(
                uri=Uri.from_str("plugin/cache"),
                method="add",
                args={"key": "key4", "value": b"value4", "timeout": None},
            )
        )

        # Test cache eviction based on LRU when the cache size is limited
        if config.size is not None:
            assert (
                await client.invoke(
                    InvokerOptions(
                        uri=Uri.from_str("plugin/cache"),
                        method="get",
                        args={"key": "key1"},
                    )
                )
                is None
            )
            assert (
                await client.invoke(
                    InvokerOptions(
                        uri=Uri.from_str("plugin/cache"),
                        method="get",
                        args={"key": "key2"},
                    )
                )
                == b"value2"
            )
            assert (
                await client.invoke(
                    InvokerOptions(
                        uri=Uri.from_str("plugin/cache"),
                        method="get",
                        args={"key": "key3"},
                    )
                )
                == b"value3"
            )
            assert (
                await client.invoke(
                    InvokerOptions(
                        uri=Uri.from_str("plugin/cache"),
                        method="get",
                        args={"key": "key4"},
                    )
                )
                == b"value4"
            )

        # Test cache expiration with default timeout
        if config.default_timeout is not None:
            frozen_time.tick(timedelta(seconds=config.default_timeout + 0.1))
            assert (
                await client.invoke(
                    InvokerOptions(
                        uri=Uri.from_str("plugin/cache"),
                        method="get",
                        args={"key": "key4"},
                    )
                )
                is None
            )
        else:
            frozen_time.tick(
                timedelta(seconds=10.0)
            )  # Advance time, but the cache item should not expire
            assert (
                await client.invoke(
                    InvokerOptions(
                        uri=Uri.from_str("plugin/cache"),
                        method="get",
                        args={"key": "key4"},
                    )
                )
                == b"value4"
            )
