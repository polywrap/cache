from datetime import timedelta
from typing import cast
from freezegun import freeze_time
from polywrap_in_memory_cache_plugin import InMemoryCachePlugin


async def test_set_with_expiry(cache: InMemoryCachePlugin):
    with freeze_time("Jan 14th, 2023") as frozen_time:
        await cache.r_set({"key": "key1", "value": b"value1", "timeout": 1}, NotImplemented, None)
        assert await cache.get({"key": "key1"}, NotImplemented, None) == b"value1"
    frozen_time.tick(cast(timedelta, 1.1))  # Advance time by 1.1 seconds
    assert await cache.get({"key": "key1"}, NotImplemented, None) is None


async def test_add_with_expiry(cache: InMemoryCachePlugin):
    with freeze_time("Jan 14th, 2023") as frozen_time:
        await cache.add({"key": "key1", "value": b"value1", "timeout": 1}, NotImplemented, None)
        assert await cache.get({"key": "key1"}, NotImplemented, None) == b"value1"
    frozen_time.tick(cast(timedelta, 1.1))  # Advance time by 1.1 seconds
    assert await cache.get({"key": "key1"}, NotImplemented, None) is None
