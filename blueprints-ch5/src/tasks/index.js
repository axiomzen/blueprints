var CronJob = require('cron').CronJob;

module.exports = function(models, mailer) {
  var tasks = {}

  tasks.followupMail = require('./followupMail')(models,mailer)

  tasks.init = function() {
    // lock seconds at 0, every 15 minutes do:
    (new CronJob('00 */15 * * * *', tasks.followupMail)).start()
  };

  return tasks
}