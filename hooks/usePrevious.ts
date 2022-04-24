import { useEffect, useRef } from "react";

export function usePrevious<T>(value: T) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value as any;
  });

  return ref.current as unknown as T;
}