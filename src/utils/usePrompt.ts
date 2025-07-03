import { useContext, useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

export function usePrompt(when: boolean, onBlock: () => void) {
  const navigator = useContext(NavigationContext).navigator as any;

  useEffect(() => {
    if (!when) return;
    const unblock = navigator.block((tx: any) => {
      onBlock();
      return false;
    });
    return () => unblock();
  }, [when, onBlock, navigator]);
}
