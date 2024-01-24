/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_CLIENT_ID: string
  readonly VITE_APP_CLIENT_SECRET: string
  readonly VITE_APP_CBL_QUERY_KEY: string
  readonly PACKAGE_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly vitest?: boolean
}
