var nodemailer = require('nodemailer')

module.exports = function (mailConfig, models){
  var methods = {}
  var transporter

  // Setup transport
  if(process.env.NODE_ENV == 'test'){
    var stubTransport = require('nodemailer-stub-transport')
    transporter = nodemailer.createTransport(stubTransport())
  } else if( mailConfig.service === 'Mailgun'){
    transporter = nodemailer.createTransport({
        service: 'Mailgun',
        auth: {
            user: mailConfig.user,
            pass: mailConfig.password
        }
    })
  } else {
    throw new Error("email service missing")
  }

  // define a simple function to deliver mails
  methods.send = function(recipients, subject, body, cb) {
    // small trick to ensure dev & tests emails go to myself
    if(process.env.NODE_ENV != 'production') recipients = ["my.own.email@provider.com"]
    transporter.sendMail({
      to: recipients,
      from: mailConfig.from,
      subject: subject,
      generateTextFromHTML: true,
      html: body
    }, function(err, info) {
      // console.info("nodemailer::send",err,info)
      if(typeof cb == 'function'){
        cb(err,info)
      }
    })
  }

  methods.followUp = require('./followUp')(methods.send, models)

  return methods
}
