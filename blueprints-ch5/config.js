module.exports = function(env) {
  var E = process.env
  var configs = {}
  configs.env = env
  configs.dbUrl = "localhost/coffee_"+env
  configs.email = {
    service: "Mailgun",
    from: E.MAIL_FROM,
    user: E.MAIL_USER,
    password: E.MAIL_PASSWORD
  }
  return configs
}