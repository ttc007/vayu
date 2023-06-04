var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "covay"
});

con.connect(function(err) {
  console.log(err, con);
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  
  console.log('Connected to database!');

  con.query("SELECT * FROM user", function (err, result, fields) {
    if (err) {
      console.error('Error executing query:', err);
      return;
    }

    console.log('Query result:', result);
  });

  con.end(function(err) {
    if (err) {
      console.error('Error closing database connection:', err);
      return;
    }
    
    console.log('Database connection closed.');
  });
});
