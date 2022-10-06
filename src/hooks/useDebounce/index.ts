import { useEffect, useRef } from 'react';

const useDebounce = () => {
  const typingSearchRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (typingSearchRef.current) {
        clearTimeout(typingSearchRef.current);
      }
    };
  }, []);

  return (cb: () => void, time: number = 500) => {
    if (typingSearchRef.current) {
      clearTimeout(typingSearchRef.current);
    }

    typingSearchRef.current = setTimeout(() => {
      cb();
    }, time);
  };
};

export default useDebounce;
