var app = require('./src/app');
var port = process.env.PORT || 8000;
app.listen(port);
console.log('Express listening on port '+port);
