import { useMediaQuery } from './useMediaQuery';

export function useIsTouch(): boolean {
  return useMediaQuery('(hover: none), (pointer: coarse)');
}
