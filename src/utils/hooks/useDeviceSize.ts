import { useMemo } from 'react';
import { useWindowSize } from 'react-use';

export function useDeviceSize(divider = 800) {
  const { width, height } = useWindowSize();

  const isSmallDevice = useMemo(() => {
    return width < divider;
  }, [divider, width]);

  return {
    width,
    height,
    isSmallDevice
  };
}
