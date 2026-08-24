/// <reference types="vite/client" />

export {};

declare global {
  interface Window {
    __SAPEX_INTRO_PLAYED_ON_LOAD?: boolean;
  }
}