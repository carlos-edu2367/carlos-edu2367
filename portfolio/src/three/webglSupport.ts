let cachedSupport: boolean | null = null;
let cachedSoftware: boolean | null = null;

export function isWebGLAvailable(): boolean {
  if (cachedSupport !== null) {
    return cachedSupport;
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  try {
    if (!('WebGLRenderingContext' in window)) {
      cachedSupport = false;
      return false;
    }
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext('experimental-webgl', {
        failIfMajorPerformanceCaveat: true,
      })) as WebGLRenderingContext | null;
    cachedSupport = Boolean(gl);
    if (gl && typeof gl.getParameter === 'function') {
      const dbg = gl.getExtension?.('WEBGL_debug_renderer_info');
      const renderer = String(
        (dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)) ?? '',
      );
      cachedSoftware = /SwiftShader|llvmpipe|Software|Basic Render Driver/i.test(renderer);
    }
    return cachedSupport;
  } catch {
    cachedSupport = false;
    return false;
  }
}

export function isSoftwareWebGL(): boolean {
  if (cachedSoftware === null) {
    isWebGLAvailable();
  }
  return Boolean(cachedSoftware);
}

export function resetWebGLCacheForTests(): void {
  cachedSupport = null;
  cachedSoftware = null;
}
