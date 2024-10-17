const cors = require('cors');
const express = require('express');
const app = express();
require("dotenv").config();

// Settings
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(express.json());
app.use(express.static('public'));

// Configure CORS for all routes
const corsOptions = {
  origin: 'https://seguridadbackendmasiclon-qrn9ajmx0-juans-projects-b17a60fc.vercel.app', // Allow requests only from your React app
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

// Enable CORS with the defined options
app.use(cors(corsOptions));

// Handle preflight requests (OPTIONS)
app.options('*', cors(corsOptions));

// Routes
app.use('/Agregados', require('./routes/Agregados'));
app.use('/Cliente', require('./routes/Cliente'));
app.use('/Combustible', require('./routes/Combustible'));
app.use('/Empleado', require('./routes/Empleado'));
app.use('/Estado', require('./routes/Estado'));
app.use('/GastosVarios', require('./routes/GastosVarios'));
app.use('/Ingresos', require('./routes/Ingresos'));
app.use('/ManoObra', require('./routes/ManoObra'));
app.use('/MaquinariaEquipo', require('./routes/MaquinariaEquipo'));
app.use('/MovimientosTierra', require('./routes/MovimientosTierra'));
app.use('/PagoPrestamo', require('./routes/PagoPrestamo'));
app.use('/Pagos', require('./routes/Pagos'));
app.use('/PagoHrsExtra', require('./routes/PagoHrsExtra'));
app.use('/Permisos', require('./routes/Permisos'));
app.use('/Prestamo', require('./routes/Prestamo'));
app.use('/Proyecto', require('./routes/Proyecto'));
app.use('/Rol', require('./routes/Rol'));
app.use('/TipoCombustible', require('./routes/TipoCombustible'));
app.use('/TipoPago', require('./routes/TipoPago'));
app.use('/TrasladosFletes', require('./routes/TrasladosFletes'));
app.use('/Usuario', require('./routes/Usuario'));
app.use('/Vehiculos_Maquinaria', require('./routes/Vehiculos_Maquinaria'));
app.use('/Home', require('./routes/Home'));
app.use('/Loggin', require('./routes/Loggin'));

// Starting the server
app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`);
});
