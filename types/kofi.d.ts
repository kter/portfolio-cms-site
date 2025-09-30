/**
 * TypeScript type declarations for Ko-fi Overlay Widget
 * https://ko-fi.com/manage/widgets
 */

declare global {
  interface Window {
    kofiWidgetOverlay?: {
      draw: (username: string, config: KofiWidgetConfig) => void;
    };
  }
}

interface KofiWidgetConfig {
  'type': 'floating-chat';
  'floating-chat.donateButton.text': string;
  'floating-chat.donateButton.background-color': string;
  'floating-chat.donateButton.text-color': string;
}

declare const kofiWidgetOverlay: Window['kofiWidgetOverlay'];

export {};