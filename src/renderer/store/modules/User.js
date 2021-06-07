/*
 * @Description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-03-31 17:49:07
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-03-31 18:57:30
 */
const state = {
  name: '',
  pwd: '',
  savePwd: false
}

const mutations = {
  CREATE_USER_DATA(state, data) {
    state.name = data.name
    state.pwd = data.pwd
    state.savePwd = data.savePwd
  }
}

const actions = {
  async createUserData({ commit }, data) {
    commit('CREATE_USER_DATA', data)
  }
}

const gettters = {
  userName: state => {
    return state.name
  },
  userPwd: state => {
    return state.pwd
  }
}

export default {
  state,
  mutations,
  actions,
  gettters
}
