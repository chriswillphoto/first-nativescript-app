export var normalizeTrackable = function(row){
  var id = row[0]
  var title = row[1]

  return {
    id: id,
    title: title
  }
}