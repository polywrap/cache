/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

// @ts-ignore
import * as Types from "./types";

// @ts-ignore
import { CoreClient, MaybeAsync } from "@polywrap/core-js";
import { PluginModule } from "@polywrap/plugin-js";

export interface Args_get {
  key: Types.String;
}

export interface Args_has {
  key: Types.String;
}

export interface Args_set {
  key: Types.String;
  value: Types.Bytes;
  timeout?: Types.Int | null;
}

export interface Args_add {
  key: Types.String;
  value: Types.Bytes;
  timeout?: Types.Int | null;
}

export interface Args_delete {
  key: Types.String;
}

export interface Args_clear {
}

export abstract class Module<TConfig> extends PluginModule<TConfig> {
  abstract get(
    args: Args_get,
    client: CoreClient,
    env?: null
  ): MaybeAsync<Types.Bytes | null>;

  abstract has(
    args: Args_has,
    client: CoreClient,
    env?: null
  ): MaybeAsync<Types.Boolean>;

  abstract set(
    args: Args_set,
    client: CoreClient,
    env?: null
  ): MaybeAsync<Types.Boolean>;

  abstract add(
    args: Args_add,
    client: CoreClient,
    env?: null
  ): MaybeAsync<Types.Boolean>;

  abstract delete(
    args: Args_delete,
    client: CoreClient,
    env?: null
  ): MaybeAsync<Types.Boolean>;

  abstract clear(
    args: Args_clear,
    client: CoreClient,
    env?: null
  ): MaybeAsync<Types.Boolean>;
}
