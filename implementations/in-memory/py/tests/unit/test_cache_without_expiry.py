from polywrap_in_memory_cache_plugin import InMemoryCachePlugin


async def test_has(mock_cache: InMemoryCachePlugin):
    assert await mock_cache.has({"key": "key1"}, NotImplemented, None) == True
    assert await mock_cache.has({"key": "key3"}, NotImplemented, None) == False


async def test_get(mock_cache: InMemoryCachePlugin):
    assert await mock_cache.get({"key": "key1"}, NotImplemented, None) == b"value1"
    assert await mock_cache.get({"key": "key3"}, NotImplemented, None) is None


async def test_add_no_overwrite(mock_cache: InMemoryCachePlugin):
    await mock_cache.add(
        {"key": "key1", "value": b"new_value1", "timeout": None}, NotImplemented, None
    )
    assert await mock_cache.get({"key": "key1"}, NotImplemented, None) == b"value1"


async def test_add(mock_cache: InMemoryCachePlugin):
    await mock_cache.add(
        {"key": "key3", "value": b"value3", "timeout": None}, NotImplemented, None
    )
    assert await mock_cache.get({"key": "key3"}, NotImplemented, None) == b"value3"


async def test_set_overwrite(mock_cache: InMemoryCachePlugin):
    await mock_cache.r_set(
        {"key": "key1", "value": b"new_value1", "timeout": None}, NotImplemented, None
    )
    assert await mock_cache.get({"key": "key1"}, NotImplemented, None) == b"new_value1"


async def test_set(mock_cache: InMemoryCachePlugin):
    await mock_cache.r_set(
        {"key": "key3", "value": b"value3", "timeout": None}, NotImplemented, None
    )
    assert await mock_cache.get({"key": "key3"}, NotImplemented, None) == b"value3"


async def test_delete(mock_cache: InMemoryCachePlugin):
    assert await mock_cache.delete({"key": "key1"}, NotImplemented, None) == True
    assert await mock_cache.get({"key": "key1"}, NotImplemented, None) is None
    assert await mock_cache.delete({"key": "key4"}, NotImplemented, None) == False


async def test_clear(mock_cache: InMemoryCachePlugin):
    await mock_cache.clear({}, NotImplemented, None)
    assert await mock_cache.get({"key": "key1"}, NotImplemented, None) is None
    assert await mock_cache.get({"key": "key2"}, NotImplemented, None) is None
    assert await mock_cache.has({"key": "key1"}, NotImplemented, None) == False
    assert await mock_cache.has({"key": "key2"}, NotImplemented, None) == False


async def test_keys(mock_cache: InMemoryCachePlugin):
    keys = await mock_cache.keys({}, NotImplemented, None)
    assert set(keys) == {"key1", "key2"}
