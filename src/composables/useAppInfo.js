import { readonly, ref } from 'vue'

export default function useAppInfo() {
  const appVersion = ref(import.meta.env.PACKAGE_VERSION)
  // const gitHash = ref(import.meta.env.VITE_APP_GIT_HASH)

  // const gitHubUrl = computed(() => {
  //   return 'https://github.com/alessandrojean/toshokan/commit/' + gitHash.value
  // })

  return {
    appVersion: readonly(appVersion)
    // gitHash: readonly(gitHash),
    // gitHubUrl
  }
}
