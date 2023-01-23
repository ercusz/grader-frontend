import * as React from 'react';

export const useIsOverflow = (
  ref: React.MutableRefObject<HTMLDivElement | null>,
  callback?: (isOverflowFromCallback: boolean) => void
) => {
  const [isOverflow, setIsOverflow] = React.useState(false);

  React.useLayoutEffect(() => {
    const { current } = ref;

    const trigger = () => {
      const hasOverflow = current
        ? current.scrollHeight > current.clientHeight
        : false;

      setIsOverflow(hasOverflow);

      if (callback) callback(hasOverflow);
    };

    if (current) {
      if ('ResizeObserver' in window) {
        new ResizeObserver(trigger).observe(current);
      }

      trigger();
    }
  }, [callback, ref]);

  return isOverflow;
};
