from datetime import timedelta
from typing import cast
import pytest
from polywrap_in_memory_cache_plugin import InMemoryCachePlugin, CacheConfig
from freezegun import freeze_time


@pytest.mark.parametrize("config", [
    CacheConfig(size=3, default_timeout=5),
    CacheConfig(size=3, default_timeout=None),
    CacheConfig(size=None, default_timeout=5),
    CacheConfig(size=None, default_timeout=None)
])
async def test_custom_cache_configurations(config: CacheConfig):
    with freeze_time("2022-01-01 12:00:00") as frozen_time:
        cache = InMemoryCachePlugin(config)

        # Test add operation
        await cache.add({"key": "key1", "value": b"value1", "timeout": None}, NotImplemented, None)
        await cache.add({"key": "key2", "value": b"value2", "timeout": None}, NotImplemented, None)
        await cache.add({"key": "key3", "value": b"value3", "timeout": None}, NotImplemented, None)

        # Test get operation
        assert await cache.get({"key": "key1"}, NotImplemented, None) == b"value1"
        assert await cache.get({"key": "key2"}, NotImplemented, None) == b"value2"
        assert await cache.get({"key": "key3"}, NotImplemented, None) == b"value3"

        # Add a new item to the cache
        await cache.add({"key": "key4", "value": b"value4", "timeout": None}, NotImplemented, None)

        # Test cache eviction based on LRU when the cache size is limited
        if config.size is not None:
            assert await cache.get({"key": "key1"}, NotImplemented, None) is None
            assert await cache.get({"key": "key2"}, NotImplemented, None) == b"value2"
            assert await cache.get({"key": "key3"}, NotImplemented, None) == b"value3"
            assert await cache.get({"key": "key4"}, NotImplemented, None) == b"value4"

        # Test cache expiration with default timeout
        if config.default_timeout is not None:
            frozen_time.tick(cast(timedelta, config.default_timeout + 0.1))
            assert await cache.get({"key": "key4"}, NotImplemented, None) is None
        else:
            frozen_time.tick(cast(timedelta, 10.0))  # Advance time, but the cache item should not expire
            assert await cache.get({"key": "key4"}, NotImplemented, None) == b"value4"
