require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("../config/db");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

//Connect to database
connectDB();

//Route files
const coWorkingSpaces = require("../routes/co-working-spaces");
const auth = require("../routes/auth");
const reservations = require("../routes/reservations");

const app = express();
//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Rate Limiting
const limiter = rateLimit({
  windowsMs: 10 * 60 * 1000, //10 mins
  max: 80,
});
app.use(limiter);

//Prevent http param pollutions
app.use(hpp());

//Enable CORS
app.use(cors());

// Swagger Options
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Co-Working Space API",
      version: "1.0.0",
      description: "API for Co-Working Space Reservations",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/api/v1"
            : "https://co-working-space-backend-kappa.vercel.app/api/v1",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Swagger UI Middleware
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

//Add the root route handler here
app.get("/", (req, res) => res.send("Co-Working Space API is running!"));
app.use("/api/v1/co-working-spaces", coWorkingSpaces);
app.use("/api/v1/auth", auth);
app.use("/api/v1/reservations", reservations);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

//handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
