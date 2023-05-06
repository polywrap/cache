from collections import OrderedDict
import pytest

from polywrap_in_memory_cache_plugin import CacheConfig, CacheItem, InMemoryCachePlugin


@pytest.fixture
async def cache():
    return InMemoryCachePlugin(CacheConfig())


@pytest.fixture
async def mock_cache():
    plugin = InMemoryCachePlugin(CacheConfig())
    plugin.cache = OrderedDict({
        "key1": CacheItem(b"value1", None),
        "key2": CacheItem(b"value2", None),
    })
    return plugin
