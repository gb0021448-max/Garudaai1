if (typeof window !== 'undefined') {
  const g = window as any;

  if (typeof g.FormData === 'undefined') {
    g.FormData = class FormData {
      private _data = new Map<string, any[]>();
      append(name: string, value: any) {
        const list = this._data.get(name) || [];
        list.push(value);
        this._data.set(name, list);
      }
      get(name: string) {
        const list = this._data.get(name);
        return list && list.length > 0 ? list[0] : null;
      }
      getAll(name: string) {
        return this._data.get(name) || [];
      }
      has(name: string) {
        return this._data.has(name);
      }
      delete(name: string) {
        this._data.delete(name);
      }
      set(name: string, value: any) {
        this._data.set(name, [value]);
      }
      *keys() {
        yield* this._data.keys();
      }
      *entries() {
        for (const [k, v] of this._data.entries()) {
          for (const item of v) {
            yield [k, item];
          }
        }
      }
      *values() {
        for (const v of this._data.values()) {
          yield* v;
        }
      }
      [Symbol.iterator]() {
        return this.entries();
      }
    };
  } else if (!g.FormData.prototype.keys) {
    g.FormData.prototype.keys = function* (this: any) {
      yield* [];
    };
  }

  const originalFetch = window.fetch;
  let currentFetch = originalFetch;

  const createGlobalProxy = (targetGlobal: any) => {
    return new Proxy(targetGlobal, {
      get(target, prop, receiver) {
        if (prop === 'fetch') {
          return function(this: any, ...args: any[]) {
            return currentFetch.apply(targetGlobal, args);
          };
        }
        const val = Reflect.get(target, prop, receiver);
        if (typeof val === 'function') {
          return val.bind(targetGlobal);
        }
        return val;
      },
      set(target, prop, value, receiver) {
        if (prop === 'fetch') {
          currentFetch = value;
          return true;
        }
        try {
          return Reflect.set(target, prop, value, receiver);
        } catch (e) {
          return true;
        }
      },
      defineProperty(target, prop, descriptor) {
        if (prop === 'fetch') {
          if ('value' in descriptor) {
            currentFetch = descriptor.value;
          }
          return true;
        }
        try {
          return Reflect.defineProperty(target, prop, descriptor);
        } catch (e) {
          return true;
        }
      },
      deleteProperty(target, prop) {
        if (prop === 'fetch') {
          return true;
        }
        try {
          return Reflect.deleteProperty(target, prop);
        } catch (e) {
          return true;
        }
      }
    });
  };

  const globalProxy = createGlobalProxy(window);

  try {
    Object.defineProperty(window, 'globalThis', {
      value: globalProxy,
      configurable: true,
      writable: true,
      enumerable: false
    });
  } catch (e2) {}

  try {
    Object.defineProperty(window, 'self', {
      value: globalProxy,
      configurable: true,
      writable: true,
      enumerable: true
    });
  } catch (e2) {}
}

export {};
