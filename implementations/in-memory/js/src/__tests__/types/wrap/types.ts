// @ts-ignore
import * as Types from "./";

// @ts-ignore
import {
  CoreClient,
  InvokeResult,
  Uri,
} from "@polywrap/core-js";

export type UInt = number;
export type UInt8 = number;
export type UInt16 = number;
export type UInt32 = number;
export type Int = number;
export type Int8 = number;
export type Int16 = number;
export type Int32 = number;
export type Bytes = Uint8Array;
export type BigInt = string;
export type BigNumber = string;
export type Json = string;
export type String = string;
export type Boolean = boolean;

/// Imported Modules START ///

/* URI: "ens/wraps.eth:cache@1.0.0" */
export interface Cache_Module_Args_get {
  key: Types.String;
}

/* URI: "ens/wraps.eth:cache@1.0.0" */
export interface Cache_Module_Args_has {
  key: Types.String;
}

/* URI: "ens/wraps.eth:cache@1.0.0" */
export interface Cache_Module_Args_set {
  key: Types.String;
  value: Types.Bytes;
  timeout?: Types.Int | null;
}

/* URI: "ens/wraps.eth:cache@1.0.0" */
export interface Cache_Module_Args_add {
  key: Types.String;
  value: Types.Bytes;
  timeout?: Types.Int | null;
}

/* URI: "ens/wraps.eth:cache@1.0.0" */
export interface Cache_Module_Args_delete {
  key: Types.String;
}

/* URI: "ens/wraps.eth:cache@1.0.0" */
export interface Cache_Module_Args_clear {
}

/* URI: "ens/wraps.eth:cache@1.0.0" */
export const Cache_Module = {
  get: async (
    args: Cache_Module_Args_get,
    client: CoreClient,
    uri: string = "ens/wraps.eth:cache@1.0.0"
  ): Promise<InvokeResult<Types.Bytes | null>> => {
    return client.invoke<Types.Bytes | null>({
      uri: Uri.from(uri),
      method: "get",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  has: async (
    args: Cache_Module_Args_has,
    client: CoreClient,
    uri: string = "ens/wraps.eth:cache@1.0.0"
  ): Promise<InvokeResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri: Uri.from(uri),
      method: "has",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  set: async (
    args: Cache_Module_Args_set,
    client: CoreClient,
    uri: string = "ens/wraps.eth:cache@1.0.0"
  ): Promise<InvokeResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri: Uri.from(uri),
      method: "set",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  add: async (
    args: Cache_Module_Args_add,
    client: CoreClient,
    uri: string = "ens/wraps.eth:cache@1.0.0"
  ): Promise<InvokeResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri: Uri.from(uri),
      method: "add",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  delete: async (
    args: Cache_Module_Args_delete,
    client: CoreClient,
    uri: string = "ens/wraps.eth:cache@1.0.0"
  ): Promise<InvokeResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri: Uri.from(uri),
      method: "delete",
      args: (args as unknown) as Record<string, unknown>,
    });
  },

  clear: async (
    args: Cache_Module_Args_clear,
    client: CoreClient,
    uri: string = "ens/wraps.eth:cache@1.0.0"
  ): Promise<InvokeResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri: Uri.from(uri),
      method: "clear",
      args: (args as unknown) as Record<string, unknown>,
    });
  }
};

/// Imported Modules END ///
