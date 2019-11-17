class Context {
  constructor(db) {
    this.db = db
  }

  getTx(cb) {
    return this.db.tx(txDb => {
      return cb(new Proxy(this, {
        get: function(obj, prop) {
          return prop === 'db' ? txDb : obj[prop]
        }
      }))
    })
  }
}

module.exports = Context
