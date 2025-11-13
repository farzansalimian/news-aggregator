// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ViteTypeOptions {}

interface ImportMetaEnv {
  readonly VITE_NEWS_API_KEY: string
  readonly VITE_GUARDIAN_KEY: string
  readonly VITE_NY_TIMES_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
