import {normalizeTrackable, normalizeMeasurable, normalizeDatapoint} from '~/utils.js'

//   state: {
//     database: null,
//     data: [],
//     trackables: [],
//     trackableLookup: {},
//     measurables: { /* trackable_id: [measurable objs] */},
//     measurablesLookup: {},
//   datapoints: { /*  measurable_id: [datapoint objs] */ }
//   }

export default {
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
      state.measurablesLookup = {}
      if(err){
        console.error(err)
      }else{
        state.measurables.all = []
        resultSet.forEach(element => {
          let normalized = normalizeMeasurable(element)
          normalized.trackable = state.trackableLookup[normalized.trackable_id]
          state.measurables[normalized.trackable_id].push(normalized)
          state.measurablesLookup[normalized.id] = normalized
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
      state.measurablesLookup[normalized.id] = normalized
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
} //end mutations