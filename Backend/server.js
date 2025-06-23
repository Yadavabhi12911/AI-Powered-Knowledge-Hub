require('dotenv').config();
const app = require("./app");
const { connectDb } = require("./config/db.js");


connectDb()
  .then(() => {
    app.listen((process.env.PORT = 9000), (err) => {
      if (err) console.log("error while starting the server..!!");

      console.log(`Server is running at ${process.env.PORT}.....`);
    });
  })
  .catch((err) => {
    console.log("error occured while connectiong to database");
    console.log(err);

    process.exit(1); 
  });
  
  


