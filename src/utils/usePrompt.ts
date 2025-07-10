import { useBeforeUnload } from "react-router-dom";

// This hook will only block browser/tab close, not in-app navigation, for now.
// For in-app navigation, the modal should be triggered by route change handlers in the page component.
export function usePrompt(when: boolean, onBlock: () => void) {
  useBeforeUnload((event) => {
    if (when) {
      event.preventDefault();
      event.returnValue = "";
      onBlock();
      return "";
    }
  });
}
