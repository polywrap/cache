import { PluginFactory, PluginPackage } from "@polywrap/plugin-js";
import { PriorityQueue } from "./priority-queue";

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
  size?: number;
  defaultTimeout?: number;
}

export interface CacheItem {
  value: Uint8Array;
  expirationTime: number | null;
}

export class InMemoryCachePlugin extends Module<InMemoryCachePluginConfig> {
  private _cache: Map<string, CacheItem> = new Map();
  private _expirationHeap: PriorityQueue<{ key: string; expirationTime: number }>;

  constructor(config: InMemoryCachePluginConfig) {
    super(config);
    this._expirationHeap = new PriorityQueue((a, b) => a.expirationTime - b.expirationTime);
  }

  private _removeExpiredItems(): void {
    const currentTime = Date.now();
    while (!this._expirationHeap.isEmpty() && this._expirationHeap.peek()?.expirationTime! <= currentTime) {
      const expiredItem = this._expirationHeap.pop()!;
      this._cache.delete(expiredItem.key);
    }
  }

  private _updateLru(key: string): void {
    const cacheItem = this._cache.get(key);
    if (cacheItem) {
      this._cache.delete(key);
      this._cache.set(key, cacheItem);
    }
  }

  private _evictIfNeeded(): void {
    if (this.config.size && this._cache.size >= this.config.size) {
      const oldestKey = this._cache.keys().next().value;
      const cacheItem = this._cache.get(oldestKey)!;
      if (cacheItem.expirationTime !== null) {
        this._expirationHeap.remove({ key: oldestKey, expirationTime: cacheItem.expirationTime });
      }
      this._cache.delete(oldestKey);
    }
  }

  // ... rest of the methods

  public get(args: Args_get): Uint8Array | null {
    this._removeExpiredItems();
    this._updateLru(args.key);
    const cacheItem = this._cache.get(args.key);
    return cacheItem ? cacheItem.value : null;
  }

  public set(args: Args_set): boolean {
    this._removeExpiredItems();
    this._evictIfNeeded();

    const timeout = args.timeout || this.config.defaultTimeout;
    const expirationTime = timeout ? Date.now() + timeout * 1000 : null;
    const cacheItem = {value: args.value, expirationTime};

    if (this._cache.has(args.key)) {
      const oldExpirationTime = this._cache.get(args.key)!.expirationTime;
      if (oldExpirationTime !== null) {
        this._expirationHeap.remove({ key: args.key, expirationTime: oldExpirationTime });
      }
    }

    this._cache.set(args.key, cacheItem);
    if (expirationTime !== null) {
      this._expirationHeap.push({ key: args.key, expirationTime });
    }

    return true;
  }

  public add(args: Args_add): boolean {
    if (this._cache.has(args.key)) return false;

    return this.set(args);
  }

  public delete(args: Args_delete): boolean {
    this._removeExpiredItems();
    const cacheItem = this._cache.get(args.key);
    if (cacheItem) {
      if (cacheItem.expirationTime !== null) {
        this._expirationHeap.remove({ key: args.key, expirationTime: cacheItem.expirationTime });
      }
      this._cache.delete(args.key);
      return true;
    }
    return false;
  }

  public clear(): boolean {
    this._cache.clear();
    this._expirationHeap = new PriorityQueue((a, b) => a.expirationTime - b.expirationTime);
    return true;
  }

  public has(args: Args_has): boolean {
    return this._cache.has(args.key);
  }

  public keys(): string[] {
    this._removeExpiredItems();
    return Array.from(this._cache.keys());
  }
}

export const inMemoryCachePlugin: PluginFactory<InMemoryCachePluginConfig> = (config: InMemoryCachePluginConfig) =>
  new PluginPackage(new InMemoryCachePlugin(config), manifest);

export const plugin = inMemoryCachePlugin;
