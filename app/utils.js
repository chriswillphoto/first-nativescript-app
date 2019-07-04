export var normalizeTrackable = function(row){
  var id = row[0]
  var title = row[1]

  return {
    id: id,
    title: title
  }
}

export var normalizeMeasurable = function(row){
  var id = row[0]
  var title = row[1]
  var type = row[2]
  var frequency = row[3]
  var trackable_id = row[4]

  return {
    id,
    title,
    type,
    frequency,
    trackable_id
  }
}

//id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, type TEXT, frequency TEXT, trackable_id INTEGER,

export var MonthLookup = {
  0: {days: 31, name: 'January'},
  1: {days: 28, name: 'Febuary'},
  2: {days: 31, name: 'March'},
  3: {days: 30, name: 'April'},
  4: {days: 31, name: 'May'},
  5: {days: 30, name: 'June'},
  6: {days: 31, name: 'July'},
  7: {days: 31, name: 'August'},
  8: {days: 30, name: 'September'},
  9: {days: 31, name: 'October'},
  10: {days: 30, name: 'November'},
  11: {days: 31, name: 'December'}
}