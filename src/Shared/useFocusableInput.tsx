import React, { useEffect, useRef } from 'react';

const useFocusableInput = (
  shouldFocus?: boolean
): {
  setInputRef: (instance: HTMLInputElement | null) => void;
  disableKeyPropagation: (e: React.KeyboardEvent) => void;
} => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setInputRef = (instance: HTMLInputElement | null) => {
    inputRef.current = instance;
  };

  const disableKeyPropagation = (e: React.KeyboardEvent) => {
    if (e.key !== 'Escape') {
      // Prevents auto-selecting item while typing (default Select behavior)
      e.stopPropagation();
    }
  };

  useEffect(() => {
    if (shouldFocus === undefined) {
      return;
    }

    let timeout: NodeJS.Timeout;
    if (shouldFocus) {
      timeout = setTimeout(() => {
        inputRef.current?.focus();
      });
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [shouldFocus]);

  return {
    setInputRef,
    disableKeyPropagation,
  };
};

export default useFocusableInput;
