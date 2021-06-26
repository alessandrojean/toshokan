import { computed, ref } from 'vue'

export default function useAppInfo () {
  const appVersion = ref(process.env.VUE_APP_VERSION)
  const gitHash = ref(process.env.VUE_APP_GIT_HASH)

  const gitHubUrl = computed(() => {
    return 'https://github.com/alessandrojean/toshokan/commit/' + gitHash.value
  })

  return {
    appVersion,
    gitHash,
    gitHubUrl
  }
}
