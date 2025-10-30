import { useEffect, useState } from "react";

type Options<T> = {
  key: string;
  defaultValue: T;
};

export const useSessionStorage = <T,>({ key, defaultValue }: Options<T>): [T, (value: T) => void] => {
  const [stored, setStored] = useState<T>(defaultValue);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const item = window.sessionStorage.getItem(key);
    if (!item) return;
    try {
      setStored(JSON.parse(item));
    } catch (error) {
      console.warn("Failed to parse session storage value", error);
      setStored(defaultValue);
    }
  }, [defaultValue, key]);

  const setValue = (value: T) => {
    setStored(value);
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(key, JSON.stringify(value));
  };

  return [stored, setValue];
};
