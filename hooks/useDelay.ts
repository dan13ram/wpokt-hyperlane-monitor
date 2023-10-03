/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef } from 'react';

type Fn = (...args: any) => void;

export const useDelay = (fn: Fn, ms = 500): Fn => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const delayCallBack = useCallback(
    (...args: any) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(fn.bind(this, ...args), ms);
    },
    [fn, ms],
  );

  return delayCallBack;
};
