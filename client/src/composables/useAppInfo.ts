import { readonly, ref } from 'vue'

export default function useAppInfo() {
  const appVersion = ref(import.meta.env.PACKAGE_VERSION)

  return { appVersion: readonly(appVersion) }
}
