import Vue from 'vue'
import Vuex from 'vuex'
// 获取token
import { getUserInfo } from '@/assets/js/common'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: getUserInfo()
  },
  mutations: {
    setUserInfo(state, data) {
      state.userInfo = data
    },
    clearUserInfo(state) {
      state.userInfo = {}
    }
  },
  actions: {
    setUserInfo({ commit }, data) {
      commit('setUserInfo', data)
    },
    clearUserInfo({ commit }) {
      commit('clearUserInfo')
    }
  }
})
