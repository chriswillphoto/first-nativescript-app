import Vue from 'vue';
import Vuex from 'vuex';

const Sqlite = require("nativescript-sqlite");
// import {createConnection, getManager} from 'typeorm/browser';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    database: null,
    data: [],
    trackables: [],
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
            state.trackables.push(element)
          });
        }
      })
    },
    loadNewTrackable(state, data){
      state.database.get(`SELECT * FROM trackables WHERE title="${data}"`, function(err, row){
        console.log(err, row)
        state.trackables.push(row)
      })
    }
  },
  actions: {
    init(context) {
      
      var db_promise = new Sqlite('mydb', async function(error, db) {
        if(error) {
          console.error('FALURE: ', error)
        } else {
          console.log('DB open? ', db.isOpen())
          await db.execSQL("CREATE TABLE IF NOT EXISTS trackables (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)", function(err, id){
            err ? console.log("ERROR: ", err) : console.log('trackable table created')
          })
          await db.execSQL("CREATE TABLE IF NOT EXISTS measurables (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, type TEXT, trackable_id INTEGER, FOREIGN KEY(trackable_id) REFERENCES trackables(id))", function(err, id){
            err ? console.log("ERROR: ", err) : console.log('measurables table created')
          })
          await context.commit('init', {database: db})
          context.commit('load')
        }
      }) 

      // (new Sqlite("my.db")).then(db => {
      //   db.execSQL("CREATE TABLE IF NOT EXISTS trackables (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)")
      //     .execSQL("CREATE TABLE IF NOT EXISTS measurables (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, type TEXT, trackable_id INTEGER, FOREIGN KEY(trackable_id) REFERENCES trackables(id))")
      //     .then(id => {
      //       context.commit("init", { database: db });
      //       console.log('TEST1')
      //     }, error => {
      //         console.log("CREATE TABLE ERROR", error);
      //     });
      // }, error => {
      //     console.log("OPEN DB ERROR", error);
      // });
    },
    addNewTrackable(context, trackableTitle){
      context.state.database.execSQL(`INSERT INTO trackables (title) VALUES ("${trackableTitle}")`, function(err, id) {
        err ? console.log("ERROR ADDING TRACKABLE: ", err) : console.log("TRACKABLE ADDED: ", id)
      })
      context.commit('loadNewTrackable', trackableTitle)
    }
  } //end actions
}); // end store

Vue.prototype.$store = store

export default store;

store.dispatch('init')