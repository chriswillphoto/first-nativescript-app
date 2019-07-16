import Vue from 'vue';
import Vuex from 'vuex';


// import {createConnection, getManager} from 'typeorm/browser';

import {normalizeTrackable, normalizeMeasurable, normalizeDatapoint} from '~/utils.js'

import mutations from '~/store/mutations.js'
import actions from '~/store/actions.js'


Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    database: null,
    data: [],
    trackables: [],
    trackableLookup: {},
    measurables: { /*t rackable_id: [measurable objs] */},
    measurablesLookup: {},
  datapoints: { /*  measurable_id: [datapoint objs] */ }
  },
  mutations: mutations,
  actions: actions,
}); // end store



Vue.prototype.$store = store

export default store;

store.dispatch('init')