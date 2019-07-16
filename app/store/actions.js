const Sqlite = require("nativescript-sqlite");

export default {
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
  },
  addDatapoint(context, data){
    console.log(data)
    context.state.database.execSQL(`INSERT INTO datapoints (value, timestamp, measurable_id, trackable_id) VALUES ("${data.value}", "${data.timestamp}", ${data.measurable_id}, ${data.trackable_id})`, function(err, id){
      console.log(err, id)
      return context.commit('load')
    })
  }
}