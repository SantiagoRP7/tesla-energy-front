import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'
import jwtDecode from 'jwt-decode'

Vue.use(Vuex)

export const API_URL = 'http://localhost:8000/'

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token_access') || null,
    status: '', // loading, success or error
    auth: { headers: null },
    profile: {}, // Loggedin user
    users: [],
    clients: []
  },
  mutations: {
    set_profile (state, profile) {
      state.profile = profile
    },
    set_users (state, users) {
      state.users = users
    },
    set_clients (state, clients) {
      state.clients = clients
    },
    logout (state) {
      localStorage.removeItem('token_access')
      localStorage.removeItem('vuex')
      state.status = null
      state.token = null
      state.auth.headers = null
    },
    auth_request (state) {
      state.status = 'loading'
    },
    auth_success (state, token) {
      state.status = 'success'
      state.token = token
      state.auth.headers = { Authorization: 'JWT ' + token }
    },
    auth_error (state) {
      state.status = 'error'
    }
  },
  actions: {
    login (context, user) {
      return new Promise((resolve, reject) => {
        context.commit('auth_request')
        axios.post(API_URL + 'api/v1/auth-jwt/', user)
          .then(res => {
            const token = res.data.token
            console.log(user)
            if (token) {
              localStorage.setItem('token_access', token) // Saves token in localStorage
              context.commit('auth_success', token) // Saves data in storate state
              resolve(res)
            } else {
              console.log('login token null error' + res)
            }
          })
          .catch(err => {
            context.commit('auth_error')
            localStorage.removeItem('token_access')
            reject(err)
          })
      })
    },
    getProfile (context) {
      return new Promise((resolve, reject) => {
        const username = jwtDecode(localStorage.getItem('token_access')).username
        console.log(username)
        axios.get(API_URL + 'api/v1/usuarios/byusername/' + username + '/', context.getters.getAuth)
          .then(res => {
            context.commit('set_profile', res.data)
            resolve(res)
          })
          .catch(err => {
            console.log('getProfile error: ' + err)
            reject(err)
          })
      })
    },
    registerUser (context, user) {
      return new Promise((resolve, reject) => {
        axios.post(API_URL + 'api/v1/usuarios/create/', user, context.getters.getAuth)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            console.log('registerUser error: ' + err)
            reject(err)
          })
      })
    },
    obtainUsers (context) {
      return new Promise((resolve, reject) => {
        axios.get(API_URL + 'api/v1/usuarios/', context.getters.getAuth)
          .then(res => {
            context.commit('set_users', res.data.results)
            resolve(res)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    logout (context) {
      context.commit('logout')
    },
    updateUser (context, user) {
      return new Promise((resolve, reject) => {
        axios.put(API_URL + 'api/v1/usuarios/byusername/' + user.username + '/', user, context.getters.getAuth)
          .then(res => {
            console.log('Usuario actualizado con éxito')
            resolve(res)
          })
          .catch(err => {
            console.log('No se pudo actualizar el usuario')
            reject(err)
          })
      })
    },
    registerClient (context, user) {
      return new Promise((resolve, reject) => {
        axios.post(API_URL + 'api/v1/clientes/create/', user, context.getters.getAuth)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            console.log('registerClients error: ' + err)
            reject(err)
          })
      })
    },
    obtainClients (context) {
      return new Promise((resolve, reject) => {
        axios.get(API_URL + 'api/v1/clientes/list/', context.getters.getAuth)
          .then(res => {
            context.commit('set_clients', res.data.results)
            resolve(res)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    updateClients (context, user) {
      return new Promise((resolve, reject) => {
        axios.put(API_URL + 'api/v1/clietes/bycedula/' + user.cedula + '/', user, context.getters.getAuth)
          .then(res => {
            console.log('Cliente actualizado con éxito')
            resolve(res)
          })
          .catch(err => {
            console.log('No se pudo actualizar el Cliente')
            reject(err)
          })
      })
    }
  },
  getters: {
    isAuthenticated (state) {
      return state.token !== null
    },
    getUsers (state) {
      return state.users
    },
    getAuth (state) {
      console.log(state.auth)
      return state.auth
    },
    getProfile (state) {
      return state.profile
    },
    getClients (state) {
      return state.clients
    }
  },
  plugins: [createPersistedState()]
})
