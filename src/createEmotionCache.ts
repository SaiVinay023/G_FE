import createCache from '@emotion/cache';

const isBrowser = typeof document !== 'undefined';

// On the client side, we need to insert the styles immediately.
export default function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}
