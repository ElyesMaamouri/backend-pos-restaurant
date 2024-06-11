const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const bodyParser = require("body-parser");
const http = require("http");
const categoriesRoutes = require("./src/routes/categoryRoutes");
const productsRoutes = require("./src/routes/productRoutes");
const tableRoutes = require("./src/routes/tableRoutes");
const userRoutes = require("./src/routes/userRoutes");
const orderRoutes = require('./src/routes/orderRoutes');
const restaurantRoutes = require('./src/routes/restaurantRoutes')
const path = require('path');
dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(cors()); // Utilisation de CORS pour permettre les requêtes depuis n'importe quelle origine
connectDB();

// Middleware d'erreur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// All Routes
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(categoriesRoutes);
app.use(productsRoutes);
app.use(tableRoutes);
app.use(userRoutes);
app.use(orderRoutes);
app.use(restaurantRoutes)

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
