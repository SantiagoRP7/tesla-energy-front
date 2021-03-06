import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'
import jwtDecode from 'jwt-decode'

Vue.use(Vuex)

export const API_URL = 'http://34.221.98.21:8000/'
// export const API_URL = 'http://localhost:8000/'

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token_access') || null,
    rol: localStorage.getItem('rol') || null,
    status: null, // loading, success or error
    auth: { headers: null },
    profile: {}, // Loggedin user
    users: [],
    clients: [],
    substations: [],
    transformers: [],
    meters: [],
    invoice: null,
    idUser: localStorage.getItem('idUser') || null
  },
  mutations: {
    set_invoice (state, invoice) {
      state.invoice = invoice
    },
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
      state.token = null
      state.status = null
      state.auth.headers = null
      state.profile = {}
      state.users = []
      state.substations = []
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
    },
    set_substations (state, substations) {
      state.substations = substations
    },
    set_transformers (state, transformers) {
      state.transformers = transformers
    },
    set_meters (state, meters) {
      state.meters = meters
    },
    set_rol (state, rol) {
      state.rol = rol
    },
    set_iduser (state, id) {
      state.idUser = id
    }
  },
  actions: {
    login (context, user) {
      return new Promise((resolve, reject) => {
        context.commit('auth_request')
        axios.post(API_URL + 'api/v1/auth-jwt/', user)
          .then(res => {
            const token = res.data.token
            if (token) {
              localStorage.setItem('token_access', token) // Saves token in localStorage
              context.commit('auth_success', token) // Saves data in storate state
              context.dispatch('getRol', user.username)
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
    getUsers (context) {
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
        axios.get(API_URL + 'api/v1/clientes/', context.getters.getAuth)
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
        axios.put(API_URL + 'api/v1/clientes/bycedula/' + user.id + '/', user, context.getters.getAuth)
          .then(res => {
            console.log('Cliente actualizado con éxito')
            resolve(res)
          })
          .catch(err => {
            console.log('No se pudo actualizar el Cliente')
            reject(err)
          })
      })
    },
    getInvoice (context, idFactura) {
      return new Promise((resolve, reject) => {
        axios.put(API_URL + 'api/v1/consumo/facturabyid/' + idFactura + '/', context.getters.getAuth)
          .then(res => {
            context.commit('set_invoice', res.data.results)
            console.log('Factura ' + idFactura + ' obtenida ')
            resolve(res)
          })
          .catch(err => {
            console.log('No se pudo obtener la factura')
            reject(err)
          })
      })
    },
    getSubstations (context) {
      return new Promise((resolve, reject) => {
        axios.get(API_URL + 'api/v1/assets/substation/', context.getters.getAuth)
          .then(res => {
            /* console.log(res.data) */
            context.commit('set_substations', res.data)
            resolve(res)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    registerSubstation (context, sub) {
      return new Promise((resolve, reject) => {
        axios.post(API_URL + 'api/v1/assets/substation/create/', sub, context.getters.getAuth)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            console.log('registerSubstation error: ' + err)
            reject(err)
          })
      })
    },
    updateSubstation (context, sub) {
      return new Promise((resolve, reject) => {
        axios.put(API_URL + 'api/v1/assets/substation/byid/' + sub.id + '/', sub, context.getters.getAuth)
          .then(res => {
            console.log('subestacion actualizado con éxito')
            resolve(res)
          })
          .catch(err => {
            console.log('No se pudo actualizar el subestacion')
            reject(err)
          })
      })
    },
    getTransformers (context) {
      return new Promise((resolve, reject) => {
        axios.get(API_URL + 'api/v1/assets/transformer/', context.getters.getAuth)
          .then(res => {
            /* console.log(res.data) */
            context.commit('set_transformers', res.data)
            resolve(res)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    registerTransformer (context, trans) {
      return new Promise((resolve, reject) => {
        axios.post(API_URL + 'api/v1/assets/transformer/create/', trans, context.getters.getAuth)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            console.log('registerTransformer error: ' + err)
            reject(err)
          })
      })
    },
    updateTransformer (context, trans) {
      return new Promise((resolve, reject) => {
        axios.put(API_URL + 'api/v1/assets/transformer/byid/' + trans.id + '/', trans, context.getters.getAuth)
          .then(res => {
            console.log('transformador actualizado con éxito')
            resolve(res)
          })
          .catch(err => {
            console.log('No se pudo actualizar el transformador')
            reject(err)
          })
      })
    },
    getMeters (context) {
      return new Promise((resolve, reject) => {
        axios.get(API_URL + 'api/v1/assets/electricmeter/', context.getters.getAuth)
          .then(res => {
            /* console.log(res.data) */
            context.commit('set_meters', res.data)
            resolve(res)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    registerMeter (context, meter) {
      return new Promise((resolve, reject) => {
        axios.post(API_URL + 'api/v1/assets/electricmeter/create/', meter, context.getters.getAuth)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            console.log('register Meter error: ' + err)
            reject(err)
          })
      })
    },
    updateMeter (context, meter) {
      return new Promise((resolve, reject) => {
        axios.put(API_URL + 'api/v1/assets/electricmeter/byid/' + meter.id + '/', meter, context.getters.getAuth)
          .then(res => {
            console.log('medidor actualizado con éxito')
            resolve(res)
          })
          .catch(err => {
            console.log('No se pudo actualizar el medidor')
            reject(err)
          })
      })
    },
    getRol (context, username) {
      return new Promise((resolve, reject) => {
        axios.get(API_URL + 'api/v1/usuarios/rolbyusername/' + username + '/')
          .then(res => {
            const rol = res.data.rol
            const id = res.data.id
            if (rol) {
              console.log('id' + id)
              localStorage.setItem('rol', rol)
              localStorage.setItem('idUser', id)
              context.commit('set_rol', rol)
              context.commit('set_iduser', id)
            } else {
              console.log('login token null error' + res)
            }
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    registerConsumo (context, consumo) {
      return new Promise((resolve, reject) => {
        axios.post(API_URL + 'api/v1/consumos/consumo/create/', consumo, context.getters.getAuth)
          .then(res => {
            console.log('register consumo sucess ')
            resolve(res)
          })
          .catch(err => {
            console.log('register consumo error: ' + err.details)
            reject(err)
          })
      })
    },
    createInvoice (context, invoice) {
      return new Promise((resolve, reject) => {
        axios.post(API_URL + 'api/v1/consumos/factura/create/', invoice, context.getters.getAuth)
          .then(res => {
            console.log('Invoice created')
            resolve(res)
          })
          .catch(err => {
            console.log('creation invoice error: ' + err)
            reject(err)
          })
      })
    },
    pay (context, id) {
      const p = {
        factura: id,
        usuario: context.getters.getIduser
      }
      return new Promise((resolve, reject) => {
        axios.post(API_URL + 'api/v1/pagos/create/', p, context.getters.getAuth)
          .then(res => {
            console.log(res)
            resolve(res)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    }
  },
  getters: {
    getInvoice (state) {
      return state.invoice
    },
    isAuthenticated (state) {
      return state.token !== null
    },
    isOP (state) {
      return state.rol === 'OP'
    },
    isAD (state) {
      return state.rol === 'AD'
    },
    isGE (state) {
      return state.rol === 'GE'
    },
    getUsers (state) {
      return state.users
    },
    getAuth (state) {
      return state.auth
    },
    getProfile (state) {
      return state.profile
    },
    getClients (state) {
      return state.clients
    },
    getSubstations (state) {
      return state.substations
    },
    getTransformers (state) {
      return state.transformers
    },
    getMeters (state) {
      return state.meters
    },
    getIduser (state) {
      return state.idUser
    }
  },
  plugins: [createPersistedState()]
})
