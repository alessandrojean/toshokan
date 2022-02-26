import { useQuery } from 'vue-query'

import axios from 'axios'

export default function useGitHubReleaseQuery () {
  const RELEASE_URL = 'https://api.github.com/repos/alessandrojean/toshokan/releases/latest'

  async function fetcher () {
    return await axios.get(RELEASE_URL)
  }

  return useQuery('github-release', fetcher, {
    select: response => response?.data?.body
  })
}
