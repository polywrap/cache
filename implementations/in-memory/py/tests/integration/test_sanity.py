import pytest
from polywrap_client import InvokerOptions, PolywrapClient
from polywrap_core import Uri


@pytest.mark.asyncio
async def test_integration_set_and_get(client: PolywrapClient):
    await client.invoke(
        InvokerOptions(
            uri=Uri.from_str("plugin/cache"),
            method="set",
            args={"key": "key1", "value": b"value1"},
        )
    )
    result = await client.invoke(
        InvokerOptions(
            uri=Uri.from_str("plugin/cache"), method="get", args={"key": "key1"}
        )
    )
    assert result == b"value1"


@pytest.mark.asyncio
async def test_integration_has(client: PolywrapClient):
    await client.invoke(
        InvokerOptions(
            uri=Uri.from_str("plugin/cache"),
            method="set",
            args={"key": "key1", "value": b"value1"},
        )
    )
    result = await client.invoke(
        InvokerOptions(
            uri=Uri.from_str("plugin/cache"), method="has", args={"key": "key1"}
        )
    )
    assert result == True


@pytest.mark.asyncio
async def test_integration_add(client: PolywrapClient):
    await client.invoke(
        InvokerOptions(
            uri=Uri.from_str("plugin/cache"),
            method="add",
            args={"key": "key1", "value": b"value1"},
        )
    )
    result = await client.invoke(
        InvokerOptions(
            uri=Uri.from_str("plugin/cache"), method="get", args={"key": "key1"}
        )
    )
    assert result == b"value1"


@pytest.mark.asyncio
async def test_integration_delete(client: PolywrapClient):
    await client.invoke(
        InvokerOptions(
            uri=Uri.from_str("plugin/cache"),
            method="set",
            args={"key": "key1", "value": b"value1"},
        )
    )
    await client.invoke(
        InvokerOptions(
            uri=Uri.from_str("plugin/cache"), method="delete", args={"key": "key1"}
        )
    )
    result = await client.invoke(
        InvokerOptions(
            uri=Uri.from_str("plugin/cache"), method="get", args={"key": "key1"}
        )
    )
    assert result is None


@pytest.mark.asyncio
async def test_integration_clear(client: PolywrapClient):
    await client.invoke(
        InvokerOptions(
            uri=Uri.from_str("plugin/cache"),
            method="set",
            args={"key": "key1", "value": b"value1"},
        )
    )
    await client.invoke(
        InvokerOptions(uri=Uri.from_str("plugin/cache"), method="clear")
    )
    result = await client.invoke(
        InvokerOptions(
            uri=Uri.from_str("plugin/cache"), method="get", args={"key": "key1"}
        )
    )
    assert result is None


@pytest.mark.asyncio
async def test_integration_keys(client: PolywrapClient):
    await client.invoke(
        InvokerOptions(
            uri=Uri.from_str("plugin/cache"),
            method="set",
            args={"key": "key1", "value": b"value1"},
        )
    )
    await client.invoke(
        InvokerOptions(
            uri=Uri.from_str("plugin/cache"),
            method="set",
            args={"key": "key2", "value": b"value2"},
        )
    )
    result = await client.invoke(
        InvokerOptions(uri=Uri.from_str("plugin/cache"), method="keys")
    )
    assert set(result) == {"key1", "key2"}
