import type { NavigateFunction } from 'react-router-dom';

/** Navigate to a pre-login help screen (closes sheet first if needed). */
export function openPreLoginScreen(
  navigate: NavigateFunction,
  path: string,
  onCloseSheet?: () => void
) {
  if (onCloseSheet) onCloseSheet();
  navigate(path);
}
