import { useQuery } from '@tanstack/vue-query'

import axios from 'axios'

interface GitHubRelease {
  name?: string
  body?: string
}

const RELEASE_URL = 'https://api.github.com/repos/alessandrojean/toshokan/releases/latest'

export default function useGitHubReleaseQuery() {
  return useQuery({
    queryKey: ['github-release'],
    queryFn: async () => {
      return await axios.get<GitHubRelease>(RELEASE_URL)
    },
    select: response => response?.data?.body,
  })
}
