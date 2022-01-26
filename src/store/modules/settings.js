const LocalStorageKeys = {
  BLUR_NSFW: 'blur_nsfw',
  GRID_MODE: 'grid_mode',
  SPOILER_MODE_COVER: 'spoiler_mode_cover',
  SPOILER_MODE_SYNOPSIS: 'spoiler_mode_synopsis',
  VIEW_MODE: 'view_mode'
}

export const SettingsMutations = {
  UPDATE_BLUR_NSFW: 'updateBlurNsfw',
  UPDATE_GRID_MODE: 'updateGridMode',
  UPDATE_SPOILER_MODE: 'updateSpoilerMode',
  UPDATE_VIEW_MODE: 'updateViewMode'
}

const state = () => ({
  blurNsfw: localStorage.getItem(LocalStorageKeys.BLUR_NSFW) === 'true',
  gridMode: localStorage.getItem(LocalStorageKeys.GRID_MODE) || 'comfortable',
  spoilerMode: {
    cover: localStorage.getItem(LocalStorageKeys.SPOILER_MODE_COVER) === 'true',
    synopsis: localStorage.getItem(LocalStorageKeys.SPOILER_MODE_SYNOPSIS) === 'true'
  },
  viewMode: localStorage.getItem(LocalStorageKeys.VIEW_MODE) || 'grid'
})

const mutations = {
  [SettingsMutations.UPDATE_BLUR_NSFW]: function (state, blurNsfw) {
    state.blurNsfw = blurNsfw
    localStorage.setItem(LocalStorageKeys.BLUR_NSFW, blurNsfw)
  },

  [SettingsMutations.UPDATE_GRID_MODE]: function (state, gridMode) {
    state.gridMode = gridMode
    localStorage.setItem(LocalStorageKeys.GRID_MODE, gridMode)
  },

  [SettingsMutations.UPDATE_SPOILER_MODE]: function (state, spoilerMode) {
    state.spoilerMode = { ...state.spoilerMode, ...spoilerMode }
    localStorage.setItem(
      LocalStorageKeys.SPOILER_MODE_COVER,
      state.spoilerMode.cover
    )
    localStorage.setItem(
      LocalStorageKeys.SPOILER_MODE_SYNOPSIS,
      state.spoilerMode.synopsis
    )
  },

  [SettingsMutations.UPDATE_VIEW_MODE]: function (state, viewMode) {
    state.viewMode = viewMode
    localStorage.setItem(LocalStorageKeys.VIEW_MODE, viewMode)
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
