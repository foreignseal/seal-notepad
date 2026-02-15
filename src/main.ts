import { getCurrentWindow } from "@tauri-apps/api/window";

// await getCurrentWindow().setDecorations(false);

const appWindow = getCurrentWindow();

// Minimize Logic
document
  .getElementById('minimize')
  ?.addEventListener('click', () => appWindow.minimize());

// Maximize Logic
document
  .getElementById('maximize')
  ?.addEventListener('click', () => appWindow.toggleMaximize());

// Close Logic
document
  .getElementById('close')
  ?.addEventListener('click', () => appWindow.close());

// export {};

