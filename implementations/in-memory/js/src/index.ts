import { PluginFactory, PluginPackage } from "@polywrap/plugin-js";

import {
  Args_add,
  Args_delete,
  Args_get,
  Args_has,
  Args_set,
  manifest,
  Module,
} from "./wrap";

export interface InMemoryCachePluginConfig extends Record<string, unknown> {
  cache?: Map<string, Uint8Array>;
}

export class InMemoryCachePlugin extends Module<InMemoryCachePluginConfig> {
  private _cache: Map<string, Uint8Array> = new Map();
  constructor(config: InMemoryCachePluginConfig) {
    super(config);

    if (config.cache) {
      config.cache.forEach((value, key) => {
        this._cache.set(key, value);
      });
    }
  }

  public set(args: Args_set): boolean {
    if (args.timeout) return false; // Timeout not implemented!
    this._cache.set(args.key, args.value);
    return true;
  }

  public add(args: Args_add): boolean {
    if (args.timeout) return false; // Timeout not implemented!
    if (this._cache.has(args.key)) return false;

    this._cache.set(args.key, args.value);
    return true;
  }

  public delete(args: Args_delete): boolean {
    return this._cache.delete(args.key);
  }

  public clear(): boolean {
    this._cache.clear();
    return true;
  }

  public get(args: Args_get): Uint8Array | null {
    return this._cache.get(args.key) ?? null;
  }

  public has(args: Args_has): boolean {
    return this._cache.has(args.key);
  }

  public keys(): string[] {
    return Array.from(this._cache.keys());
  }
}

export const inMemoryCachePlugin: PluginFactory<InMemoryCachePluginConfig> = () =>
  new PluginPackage(new InMemoryCachePlugin({}), manifest);

export const plugin = inMemoryCachePlugin;
