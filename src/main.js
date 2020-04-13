// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import "babel-polyfill"

import HeaderNav from './components/Header.vue'
import FooterNav from './components/Footer.vue'
Vue.component('HeaderNav', HeaderNav)
Vue.component('FooterNav', FooterNav)

import waterfall from 'vue-waterfall2'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//axios
import Axios from 'axios'
import {BASEURL} from '../static/js/api.js'
Axios.defaults.baseURL= BASEURL;
Axios.defaults.withCredentials = true;
Vue.prototype.$ = Axios;

//excel表格
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)



Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(waterfall);
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        username: ''
    },
    mutations: {
        userName(state, username) {
            state.username = username;
        }
    }
})



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
