var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');
var employees = require('./routes/employees.js');
var deletetask = require('./routes/delete.js');
var connectionString;

app.set('port', process.env.PORT || 3000);

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/salarycalc';
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/employees', employees);
app.use("/deletetask", deletetask);

pg.connect(connectionString, function(err, client, done){
  if (err) {
    console.log('Error connecting to DB!', err);
  } else {
        var query = client.query('CREATE TABLE IF NOT EXISTS employees (' +
        'id SERIAL PRIMARY KEY,' +
        'firstname varchar(20),' +
        'lastname varchar(20),' +
        'emp_id varchar(10),' +
        'title varchar(30),' +
        'salary integer);'
      );

      query.on('end', function(){
        console.log('Successfully ensured schema exists');
        done();
      });

      query.on('error', function() {
        console.log('Error creating schema!');
        done();
      });
    }
});

app.get('/*', function(req, res) {
    var file = req.params[0] || '/views/index.html';
    res.sendFile(path.join(__dirname, './public', file));
});

app.listen(app.get('port'), function() {
    console.log('Listening on port: ', app.get('port'));
});
