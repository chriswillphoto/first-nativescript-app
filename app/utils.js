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