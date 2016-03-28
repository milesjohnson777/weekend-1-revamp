var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString;

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/employees_db';
}

router.get('/', function(req, res) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM employees ORDER BY lastname;');
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            done();
            return res.json(results);
        });

        if(err) {
            console.log(err);
        }
    });
});

router.post('/', function(req, res) {
    var addPerson = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        emp_id: req.body.emp_id,
        title: req.body.title,
        salary: req.body.salary
    };

    pg.connect(connectionString, function(err, client, done) {
        client.query("INSERT INTO employees (firstname, lastname, emp_id, title, salary) VALUES ($1, $2, $3, $4, $5) RETURNING id",
            [addPerson.firstname, addPerson.lastname, addPerson.emp_id, addPerson.title, addPerson.salary],
            function (err, result) {
                done();

                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                } else {
                    res.send(result);
                }
            });
    });
});

module.exports = router;
