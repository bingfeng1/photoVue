import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo : sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : {}
  },
  mutations: {
    setUserInfo(state,data){
      state.userInfo = data
    },
    clearUserInfo(state){
      state.userInfo = {}
    }
  },
  actions: {
    setUserInfo({commit},data){
      commit('setUserInfo',data)
    },
    clearUserInfo({commit}){
      commit('clearUserInfo')
    }
  }
})
