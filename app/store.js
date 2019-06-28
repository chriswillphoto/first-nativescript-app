import Vue from 'vue';
import Vuex from 'vuex';

const Sqlite = require("nativescript-sqlite");
// import {createConnection, getManager} from 'typeorm/browser';

import {normalizeTrackable, normalizeMeasurable} from '~/utils.js'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    database: null,
    data: [],
    trackables: [],
    measurables: {},
  },
  mutations: {
    init(state, data) {
      state.database = data.database
      console.log("DATABASE INIT", state.database.isOpen())
    },
    load(state, data) {
      state.database.all('SELECT * FROM trackables', (err, resultSet) => {
        state.trackables = []
        if(err){
          console.error(err)
        }else{
          resultSet.forEach(element => {
            let normalized = normalizeTrackable(element)
            state.trackables.push(normalized)
            state.measurables[normalized.id] = []
            console.log(normalized.id, 'MEASURABLES', state.measurables[normalized.id])
          });
        }
      })

      state.database.all('SELECT * FROM measurables', (err, resultSet) => {
        
        if(err){
          console.error(err)
        }else{
          resultSet.forEach(element => {
            let normalized = normalizeMeasurable(element)
            state.measurables[normalized.trackable_id].push(normalized)
          })
        }
      })
    },
    loadNewTrackable(state, data){
      state.database.get(`SELECT * FROM trackables WHERE title="${data}"`, function(err, row){
        let normalized = normalizeTrackable(row)
        console.log(err, row)
        state.trackables.push(normalized)
        state.measurables[normalized.id] = []
      })
    }
  }, //end mutations
  actions: {
    init(context) {
      // Sqlite.deleteDatabase('mydb')
      var db_promise = new Sqlite('mydb', async function(error, db) {
        if(error) {
          console.error('FALURE: ', error)
        } else {
          console.log('DB open? ', db.isOpen())
          await db.execSQL("CREATE TABLE IF NOT EXISTS trackables (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)", function(err, id){
            err ? console.log("ERROR: ", err) : console.log('trackable table created')
          })
          await db.execSQL("CREATE TABLE IF NOT EXISTS measurables (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, type TEXT, frequency TEXT, trackable_id INTEGER, FOREIGN KEY(trackable_id) REFERENCES trackables(id) ON DELETE CASCADE)", function(err, id){
            err ? console.log("ERROR: ", err) : console.log('measurables table created')
          })
          await context.commit('init', {database: db})
          context.commit('load')
        }
      }) 
    },
    addNewTrackable(context, trackableTitle){
      context.state.database.execSQL(`INSERT INTO trackables (title) VALUES ("${trackableTitle}")`, function(err, id) {
        err ? console.log("ERROR ADDING TRACKABLE: ", err) : console.log("TRACKABLE ADDED: ", id)
      })
      context.commit('loadNewTrackable', trackableTitle)
    },
    deleteTrackable(context, trackableID){
      console.log(trackableID)
    },
    addMeasurable(context, data){

    }
  } //end actions
}); // end store



Vue.prototype.$store = store

export default store;

store.dispatch('init')