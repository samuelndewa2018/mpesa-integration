const app = require("./app");

// Handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server for Handling uncaught Exception`);
});


// create server
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT:${process.env.PORT} i.e at http://localhost:${process.env.PORT}`
  );
});

// Unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down server for ${err}`);
  console.log(`Shutting down the server due to Unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
