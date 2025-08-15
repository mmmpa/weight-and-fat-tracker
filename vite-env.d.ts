// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GIT_COMMIT_HASH: string;
  // 他のカスタム環境変数をここに追加
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
