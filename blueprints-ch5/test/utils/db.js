if(!process.env.NODE_ENV) process.env.NODE_ENV  = 'test'

module.exports = function(finish) {
  var async = require('async')
  var config = require('../../config')(process.env.NODE_ENV)
  var models = require('../../src/models')(config.dbUrl)
  var collections = []
  for(var k in models) collections.push(models[k].collection)
  async.each(collections, 
    function(collection,cb) {
      collection.remove({},cb)
    },
    function(err) {
      finish()
    }
  )
}