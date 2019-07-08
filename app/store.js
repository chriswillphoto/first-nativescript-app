import Vue from 'vue';
import Vuex from 'vuex';

const Sqlite = require("nativescript-sqlite");
// import {createConnection, getManager} from 'typeorm/browser';

import {normalizeTrackable, normalizeMeasurable, normalizeDatapoint} from '~/utils.js'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    database: null,
    data: [],
    trackables: [],
    trackableLookup: {},
    measurables: {
      //[
        //trackable_id: measurable obj
      //]
    },
    datapoints: {
      //[
      //  measurable_id: datapoint obj
      //]
    }
  },
  mutations: {
    init(state, data) {
      state.database = data.database
      console.log("DATABASE INIT", state.database.isOpen())
    },
    load(state, data) {
      // fetch trackables
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
      // fetch measurables
      state.database.all('SELECT * FROM measurables', (err, resultSet) => {
        if(err){
          console.error(err)
        }else{
          state.measurables.all = []
          resultSet.forEach(element => {
            let normalized = normalizeMeasurable(element)
            normalized.trackable = state.trackableLookup[normalized.trackable_id]
            state.measurables[normalized.trackable_id].push(normalized)
            state.datapoints[normalized.id] = []
            state.measurables.all.push(normalized)
          })
          console.log('MEASURABLES ALL', state.measurables.all)
        }
      })
      //fetch datapoints
      state.database.all('SELECT * FROM datapoints', (err, resultSet) => {
        if(err){
          console.log(err)
        }else{
          state.datapoints.all = []
          resultSet.forEach(element => {
            let normalized = normalizeDatapoint(element)
            state.datapoints[normalized.measurable_id].push(normalized)
            state.datapoints.all.push(normalized) // TODO: DELETE ALL ARRAY IN PRODUCTION
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
        state.trackableLookup[normalized.id] = normalized
      })
    },
    deleteFromTrackables(state, deleteID) {
      state.trackables = state.trackables.filter((track) => {
        return track.id != deleteID
      })
      state.trackableLookup[deleteID] = null
      state.measurables[deleteID] = null
      state.measurables.all = state.measurables.all.filter((measurable) => {
        return measurable.trackable_id != deleteID
      })
    },
    loadNewMeasurable(state, data){
      state.database.get(`SELECT * FROM measurables WHERE id=${data}`, function(err, row){
        let normalized = normalizeMeasurable(row)
        normalized.trackable = state.trackableLookup[normalized.trackable_id] 
        state.measurables[normalized.trackable_id].push(normalized)
        state.measurables.all.push(normalized)
      })
    },
    deleteFromMeasurables(state, data){
      state.measurables[data.trackableID] = state.measurables[data.trackableID].filter((measure) => {
        return measure.id != data.measurableID
      })
      state.measurables.all = state.measurables.all.filter((measure) => {
        return measure.id != data.measurableID
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
          await db.execSQL("CREATE TABLE IF NOT EXISTS datapoints (id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT NOT NULL, timestamp TEXT NOT NULL, measurable_id INTEGER, trackable_id INTEGER, FOREIGN KEY(measurable_id) REFERENCES measurables(id) ON DELETE CASCADE, FOREIGN KEY(trackable_id) REFERENCES trackables(id))", function(err, id){
            err ? console.log("ERROR: ", err) : console.log('datapoints table created')
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
      // context.commit('load')
    },
    addMeasurable(context, measurableData){
      console.log(measurableData)

      context.state.database.execSQL(`INSERT INTO measurables (title, type, frequency, trackable_id) VALUES ("${measurableData.title}", "${measurableData.type}", "${measurableData.frequency}", ${measurableData.trackable_id})`, function(err, id){
        console.log(err, id)
        context.commit('loadNewMeasurable', id)
      })
    },
    editMeasurable(context, measurableData){
      console.log(measurableData)
      context.state.database.execSQL(`UPDATE measurables SET title = '${measurableData.title}', type = '${measurableData.type}', frequency = '${measurableData.frequency}' WHERE id=${measurableData.id}`, function(err, id){
        console.log(err, id)
        context.commit('load')
      })
      
    },
    deleteMeasurable(context, measurableData){
      context.state.database.execSQL(`DELETE FROM measurables WHERE id=${measurableData.measurableID}`, function(err, id){
        console.log(err, id)
        context.commit('deleteFromMeasurables', measurableData)
      })
    }
  } //end actions
}); // end store



Vue.prototype.$store = store

export default store;

store.dispatch('init')