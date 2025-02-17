const express = require('express'); // Explicación: Requerimos express para crear la aplicación.
const bodyParser = require('body-parser'); // Usamos body-parser para analizar los datos enviados en el cuerpo de las solicitudes HTTP. Necesitamos esto para procesar correctamente los datos del formulario.

const middlewares = require('./middlewares'); //Cargamos el archivo de middlewares que contiene funciones que se ejecutan antes de llegar a las rutas de la aplicación, (por ejemplo, para validar la palabra secreta o verificar la sesión activa).
const routes = require('./routes'); //Cargamos el archivo de rutas para definir los puntos finales que manejan las solicitudes HTTP.
const dotenv = require('dotenv'); // Nos permite cargar variables de entorno desde un archivo .env, como la palabra secreta.

dotenv.config(); // Este comando carga las variables de entorno definidas en el archivo .env en el entorno de Node.js. Aquí es donde se encuentra la palabra secreta que el usuario tiene que adivinar.



const app = express(); // Inicializamos la aplicación Express, que nos permite definir rutas, middlewares y configuraciones del servidor.
const PORT = 4000; // Establecemos el puerto en el que el servidor va a escuchar las solicitudes (en este caso, el puerto 4000).

app.use(express.json()); 

middlewares.setupAPP(app); //Este es un middleware que configura otras configuraciones necesarias en la aplicación, como la integración de los middlewares específicos de la aplicación.
routes.setup(app); //Está configurando todas las rutas de la aplicación que están definidas en el archivo routes.js.



app.listen(PORT, () => { //Inicia el servidor en el puerto definido y muestra un mensaje en la consola para indicar que el servidor está funcionando.
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
  });