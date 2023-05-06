# conftest.py
import pytest

from polywrap_client import PolywrapClient
from polywrap_core import Uri
from polywrap_uri_resolvers import FsUriResolver, SimpleFileReader
from polywrap_client_config_builder import PolywrapClientConfigBuilder
from polywrap_in_memory_cache_plugin import in_memory_cache_plugin, CacheConfig

@pytest.fixture
def builder():
    return PolywrapClientConfigBuilder().add_resolver(
        FsUriResolver(file_reader=SimpleFileReader())
    ).set_package(
        Uri.from_str("plugin/cache"), in_memory_cache_plugin(CacheConfig())
    )

@pytest.fixture
def client(builder: PolywrapClientConfigBuilder):
    config = builder.build()
    return PolywrapClient(config)
