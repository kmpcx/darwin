import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { stat } from 'fs'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: localStorage.getItem('user') || '',
    username: localStorage.getItem('username') || '',
    isAdmin: localStorage.getItem('isAdmin') || '0',
  },
  mutations: {
    auth_request (state) {
      state.status = 'loading'
    },
    auth_success (state, token, user, username, isAdmin) {
      state.status = 'success',
      state.token = token,
      state.user = user,
      state.username = username,
      state.isAdmin = isAdmin
    },
    auth_error (state) {
      state.status = 'error'
    },
    logout (state) {
      state.status = 'logout'
      state.token = '',
      state.user = '',
      state.username = '',
      state.isAdmin = '0'
    }
  },
  actions: {
    login ({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({ url: process.env.VUE_APP_API + '/auth/login', data: user, method: 'POST' })
          .then(resp => {
            const token = resp.data.token
            const user = resp.data.user
            localStorage.setItem('token', token)
            localStorage.setItem('user', user.UserId)
            localStorage.setItem('username', user.Username)
            localStorage.setItem('isAdmin', user.IsAdmin)
            axios.defaults.headers.common.Authorization = token
            commit('auth_success', token, user.UserId, user.Username, user.IsAdmin)
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error')
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('username')
            localStorage.removeItem('isAdmin')
            reject(err)
          })
      })
    },
    register ({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({ url: process.env.VUE_APP_API + '/auth/register', data: user, method: 'POST' })
          .then(resp => {
            const token = resp.data.token
            const user = resp.data.user
            localStorage.setItem('token', token)
            localStorage.setItem('user', user.UserId)
            localStorage.setItem('username', user.Username)
            localStorage.setItem('isAdmin', user.IsAdmin)
            axios.defaults.headers.common.Authorization = token
            commit('auth_success', token, user)
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error', err)
            localStorage.removeItem('token')
            reject(err)
          })
      })
    },
    logout ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('logout')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('username')
        localStorage.removeItem('isAdmin')
        delete axios.defaults.headers.common.Authorization
        resolve()
      })
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    getUserId: state => state.user,
    getUsername: state => state.username,
    getIsAdmin: state => state.isAdmin
  }
})
