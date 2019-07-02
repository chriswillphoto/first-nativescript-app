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
    trackableLookup: {},
    measurables: {}
  },
  mutations: {
    init(state, data) {
      state.database = data.database
      console.log("DATABASE INIT", state.database.isOpen())
    },
    load(state, data) {
      state.database.all('SELECT * FROM trackables', (err, resultSet) => {
        state.trackables = []
        state.trackableLookup = {}
        if(err){
          console.error(err)
        }else{
          resultSet.forEach(element => {
            let normalized = normalizeTrackable(element)
            state.trackables.push(normalized)
            state.measurables[normalized.id] = []
            state.trackableLookup[normalized.id] = normalized
            console.log(normalized.id, 'MEASURABLES', state.measurables[normalized.id])
          });
          console.log(state.trackableLookup)
        }
      })

      state.database.all('SELECT * FROM measurables', (err, resultSet) => {
        
        if(err){
          console.error(err)
        }else{
          state.measurables.all = []
          resultSet.forEach(element => {
            let normalized = normalizeMeasurable(element)
            normalized.trackable = state.trackableLookup[normalized.trackable_id]
            state.measurables[normalized.trackable_id].push(normalized)
            state.measurables.all.push(normalized)
          })
        }
      })
    },
    loadNewTrackable(state, data){
      state.database.get(`SELECT * FROM trackables WHERE title="${data}"`, function(err, row){
        let normalized = normalizeTrackable(row)
        console.log('Err: ', err, 'Row: ', row)
        state.trackables.push(normalized)
        state.measurables[normalized.id] = []
      })
    },
    deleteFromTrackables(state, trackableID) {
      state.trackables = state.trackables.filter((track) => {
        return track.id != trackableID
      })
      state.trackableLookup[trackableID] = null
      state.measurables[trackableID] = null
      state.measurables.all = state.measurables.all.filter((measurable) => {
        return measurable.trackable_id != trackableID
      })
    },
    loadNewMeasurable(state, data){
      state.database.get(`SELECT * FROM measurables WHERE id=${data}`, function(err, row){
        let normalized = normalizeMeasurable(row)
        normalized.trackable = state.trackableLookup[normalized.trackable_id] 
        state.measurables[normalized.trackable_id].push(normalized)
        state.measurables.all.push(normalized)
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
    editTrackable(context, updateData){
      context.state.database.execSQL(`UPDATE trackables SET title = '${updateData.title}' WHERE id = ${updateData.id} `, function(err, id) {
        err ? console.log("ERROR EDITING TRACKABLE: ", err) : console.log("TRACKABLE EDITED: ", id)
      })

      context.commit('load')
    },
    deleteTrackable(context, trackableID){
      context.state.database.execSQL(`DELETE FROM trackables WHERE id=${trackableID}`, function(err, id){
        err ? console.log("ERROR DELETING TRACKABLE: ", err) : console.log("TRACKABLE DELETED: ", id)
      })

      context.commit('deleteFromTrackables', trackableID)
    },
    addMeasurable(context, measurableData){
      console.log(measurableData)

      context.state.database.execSQL(`INSERT INTO measurables (title, type, frequency, trackable_id) VALUES ("${measurableData.title}", "${measurableData.type}", "${measurableData.frequency}", ${measurableData.trackable_id})`, function(err, id){
        console.log(err, id)
        context.commit('loadNewMeasurable', id)
      })
    }
  } //end actions
}); // end store



Vue.prototype.$store = store

export default store;

store.dispatch('init')