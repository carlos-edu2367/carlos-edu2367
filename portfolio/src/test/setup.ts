import '@testing-library/jest-dom/vitest';

// Mock matchMedia for jsdom tests
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// Mock IntersectionObserver for jsdom tests
if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
  });
}

// Mock ResizeObserver for jsdom tests
if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: MockResizeObserver,
  });
}

// Provide in-memory Web Storage when Node 22+ --localstorage-file shadows jsdom storage
function createMemoryStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(String(key), String(value));
    },
  };
}

if (typeof window !== 'undefined') {
  if (!window.localStorage || typeof window.localStorage.getItem !== 'function') {
    Object.defineProperty(window, 'localStorage', {
      writable: true,
      configurable: true,
      value: createMemoryStorage(),
    });
  }
  if (!window.sessionStorage || typeof window.sessionStorage.getItem !== 'function') {
    Object.defineProperty(window, 'sessionStorage', {
      writable: true,
      configurable: true,
      value: createMemoryStorage(),
    });
  }
}
