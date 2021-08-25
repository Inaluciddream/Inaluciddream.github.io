import variables from '@/assets/css/element-variables.scss'
import defaultSettings from '@/settings'

const { showSettings, tagNav, fixedHeader, sidebarLogo } = defaultSettings

const state = {
    theme: variables.theme,
    showSettings: showSettings,
    tagNav: tagNav,
    fixedHeader: fixedHeader,
    sidebarLogo: sidebarLogo
}

const mutations = {
    CHANGE_SETTING: (state, { key, value }) => {
        // eslint-disable-next-line no-prototype-builtins
        if (state.hasOwnProperty(key)) {
            state[key] = value
        }
    }
}

const actions = {
    changeSetting({ commit }, data) {
        commit('CHANGE_SETTING', data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

