/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.
import { WrapManifest } from "@polywrap/wrap-manifest-types-js"

export const manifest: WrapManifest = {
  name: "InMemoryCache",
  type: "plugin",
  version: "0.1",
  abi: {
  "moduleType": {
    "kind": 128,
    "methods": [
      {
        "arguments": [
          {
            "kind": 34,
            "name": "key",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "key",
              "required": true,
              "type": "String"
            },
            "type": "String"
          }
        ],
        "comment": "Look up key in the cache and return the value for it if exists otherwise returns null",
        "kind": 64,
        "name": "get",
        "required": true,
        "return": {
          "kind": 34,
          "name": "get",
          "scalar": {
            "kind": 4,
            "name": "get",
            "type": "Bytes"
          },
          "type": "Bytes"
        },
        "type": "Method"
      },
      {
        "arguments": [
          {
            "kind": 34,
            "name": "key",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "key",
              "required": true,
              "type": "String"
            },
            "type": "String"
          }
        ],
        "comment": "Checks if a key exists in the cache without returning it.",
        "kind": 64,
        "name": "has",
        "required": true,
        "return": {
          "kind": 34,
          "name": "has",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "has",
            "required": true,
            "type": "Boolean"
          },
          "type": "Boolean"
        },
        "type": "Method"
      },
      {
        "arguments": [
          {
            "kind": 34,
            "name": "key",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "key",
              "required": true,
              "type": "String"
            },
            "type": "String"
          },
          {
            "kind": 34,
            "name": "value",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "value",
              "required": true,
              "type": "Bytes"
            },
            "type": "Bytes"
          },
          {
            "kind": 34,
            "name": "timeout",
            "scalar": {
              "kind": 4,
              "name": "timeout",
              "type": "Int"
            },
            "type": "Int"
          }
        ],
        "comment": "Add a new key/value to the cache (overwrites value, if key already exists in the cache).",
        "kind": 64,
        "name": "set",
        "required": true,
        "return": {
          "kind": 34,
          "name": "set",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "set",
            "required": true,
            "type": "Boolean"
          },
          "type": "Boolean"
        },
        "type": "Method"
      },
      {
        "arguments": [
          {
            "kind": 34,
            "name": "key",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "key",
              "required": true,
              "type": "String"
            },
            "type": "String"
          },
          {
            "kind": 34,
            "name": "value",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "value",
              "required": true,
              "type": "Bytes"
            },
            "type": "Bytes"
          },
          {
            "kind": 34,
            "name": "timeout",
            "scalar": {
              "kind": 4,
              "name": "timeout",
              "type": "Int"
            },
            "type": "Int"
          }
        ],
        "comment": "Works like set() but does not overwrite the values of already existing keys.",
        "kind": 64,
        "name": "add",
        "required": true,
        "return": {
          "kind": 34,
          "name": "add",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "add",
            "required": true,
            "type": "Boolean"
          },
          "type": "Boolean"
        },
        "type": "Method"
      },
      {
        "arguments": [
          {
            "kind": 34,
            "name": "key",
            "required": true,
            "scalar": {
              "kind": 4,
              "name": "key",
              "required": true,
              "type": "String"
            },
            "type": "String"
          }
        ],
        "comment": "Delete key from the cache. Returns true if key exists in cache and has been deleted successfully",
        "kind": 64,
        "name": "delete",
        "required": true,
        "return": {
          "kind": 34,
          "name": "delete",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "delete",
            "required": true,
            "type": "Boolean"
          },
          "type": "Boolean"
        },
        "type": "Method"
      },
      {
        "comment": "Clears the whole cache. ",
        "kind": 64,
        "name": "clear",
        "required": true,
        "return": {
          "kind": 34,
          "name": "clear",
          "required": true,
          "scalar": {
            "kind": 4,
            "name": "clear",
            "required": true,
            "type": "Boolean"
          },
          "type": "Boolean"
        },
        "type": "Method"
      }
    ],
    "type": "Module"
  },
  "version": "0.1"
}
}
