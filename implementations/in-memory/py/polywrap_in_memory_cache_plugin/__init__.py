"""This package contains the InMemoryCache plugin."""

import heapq
from collections import OrderedDict
from dataclasses import dataclass
from time import time
from typing import List, NamedTuple, Optional, Tuple

from polywrap_core import InvokerClient, UriPackageOrWrapper
from polywrap_plugin import PluginPackage

from .wrap import *
from .wrap import manifest


@dataclass(slots=True, kw_only=True)
class CacheConfig:
    """Configuration for the InMemoryCachePlugin."""
    size: Optional[int] = None
    default_timeout: Optional[int] = None


class CacheItem(NamedTuple):
    """A cached item."""
    value: bytes
    expiration_time: Optional[float]


class InMemoryCachePlugin(Module[CacheConfig]):
    """A plugin that implements an in-memory cache."""

    def __init__(self, config: CacheConfig):
        """Initialize the InMemoryCachePlugin."""
        self.cache: OrderedDict[str, CacheItem] = OrderedDict()
        self.config = config
        self.expiration_heap: List[Tuple[float, str]] = []

    def _remove_expired_items(self):
        """Remove expired items from the cache."""
        while self.expiration_heap:
            expiration_time, key = self.expiration_heap[0]
            if time() <= expiration_time:
                break

            heapq.heappop(self.expiration_heap)
            self.cache.pop(key, None)
        # Remove items based on LRU eviction policy
        if self.config.size is not None and len(self.cache) >= self.config.size:
            oldest_key, oldest_item = self.cache.popitem(last=False)
            # Remove the item's expiration_time from the expiration_heap if it exists
            if oldest_item.expiration_time is not None:
                self.expiration_heap.remove((oldest_item.expiration_time, oldest_key))


    async def r_set(
        self,
        args: ArgsSet,
        client: InvokerClient[UriPackageOrWrapper],
        env: None
    ) -> bool:
        """Set a value for the given key in the cache, overwrite existing value."""
        self._remove_expired_items()

        timeout = args.get("timeout")
        if timeout is None:
            timeout = self.config.default_timeout
        expiration_time = time() + timeout if timeout else None

        if args["key"] in self.cache:
            old_expiration_time = self.cache[args["key"]].expiration_time
            if old_expiration_time is not None:
                self.expiration_heap.remove((old_expiration_time, args["key"]))

        cache_item = CacheItem(value=args["value"], expiration_time=expiration_time)
        self.cache[args["key"]] = cache_item
        if expiration_time is not None:
            heapq.heappush(self.expiration_heap, (expiration_time, args["key"]))

        return True

    async def get(
        self,
        args: ArgsGet,
        client: InvokerClient[UriPackageOrWrapper],
        env: None
    ) -> Optional[bytes]:
        """Get a value for the given key from the cache."""
        if item := self.cache.get(args["key"]):
            value, expiration_time = item
            if expiration_time is None or time() <= expiration_time:
                # Move the accessed item to the end of the OrderedDict
                self.cache.move_to_end(args["key"])
                return value
        return None

    async def has(
        self,
        args: ArgsHas,
        client: InvokerClient[UriPackageOrWrapper],
        env: None
    ) -> bool:
        """Check if a key exists in the cache."""
        return await self.get(args, client, env) is not None

    async def add(
        self,
        args: ArgsAdd,
        client: InvokerClient[UriPackageOrWrapper],
        env: None
    ) -> bool:
        """Add a value for the given key in the cache, without overwriting existing value."""
        return False if await self.has(args, client, env) else await self.r_set(args, client, env)

    async def delete(
        self,
        args: ArgsDelete,
        client: InvokerClient[UriPackageOrWrapper],
        env: None
    ) -> bool:
        """Delete a value for the given key from the cache."""
        if args["key"] in self.cache:
            del self.cache[args["key"]]
            return True
        return False

    async def clear(
        self,
        args: ArgsClear,
        client: InvokerClient[UriPackageOrWrapper],
        env: None
    ) -> bool:
        """Clear the cache."""
        self.cache = OrderedDict()
        self.expiration_heap = []
        return True

    async def keys(
        self,
        args: ArgsKeys,
        client: InvokerClient[UriPackageOrWrapper],
        env: None
    ) -> list[str]:
        """Get all keys in the cache."""
        self._remove_expired_items()
        return list(self.cache.keys())


def in_memory_cache_plugin(config: CacheConfig) -> PluginPackage[CacheConfig]:
    """Create a PluginPackage for the InMemoryCachePlugin."""
    return PluginPackage(
        module=InMemoryCachePlugin(config),
        manifest=manifest
    )
