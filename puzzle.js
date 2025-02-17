// Snippets de código para poder componer el programa

//Usado?: Sí
const bodyParser = require('body-parser');
//--- Explicación: Usamos body-parser para analizar los datos enviados en el cuerpo de las solicitudes HTTP. Necesitamos esto para procesar correctamente los datos del formulario.


//Usado?: Sí
const session = require('express-session');
//--- Explicación: Para gestionar las sesiones de los usuarios, lo cual permite almacenar información entre diferentes solicitudes.


//Usado?: Sí 
const express = require('express');
//--- Explicación: Requerimos express para crear la aplicación.


//Usado?: Sí
const dotenv = require('dotenv');
//--- Explicación: Nos permite cargar variables de entorno desde un archivo .env, como la palabra secreta.


//Usado?: Sí
const middlewares = require('./middlewares');
//--- Explicación: Cargamos el archivo de middlewares que contiene funciones que se ejecutan antes de llegar a las rutas de la aplicación, (por ejemplo, para validar la palabra secreta o verificar la sesión activa).


//Usado?: Sí
const routes = require('./routes');
//--- Explicación: Cargamos el archivo de rutas para definir los puntos finales que manejan las solicitudes HTTP.


//Usado?: Sí
dotenv.config();
//--- Explicación: Este comando carga las variables de entorno definidas en el archivo .env en el entorno de Node.js. Aquí es donde se encuentra la palabra secreta que el usuario tiene que adivinar.


//Usado?: Sí
const app = express();
//--- Explicación: Inicializamos la aplicación Express, que nos permite definir rutas, middlewares y configuraciones del servidor.


//Usado?: Sí
const PORT = 4000;
//--- Explicación: Establecemos el puerto en el que el servidor va a escuchar las solicitudes (en este caso, el puerto 4000).


//Usado?: Sí
middlewares.setupApp(app);
//--- Explicación: Este es un middleware que configura otras configuraciones necesarias en la aplicación, como la integración de los middlewares específicos de la aplicación.


//Usado?: Sí
routes.setup(app);
//--- Explicación: Está configurando todas las rutas de la aplicación que están definidas en el archivo routes.js.


//Usado?: Sí
const validarPalabraMiddleware = (req, res, next) => {
  const palabraCorrecta = process.env.PALABRA_SECRETA || '';

  if (req.body.palabra === palabraCorrecta) {
    req.session.palabraSecreta = req.body.palabra;
    next();
  } else {
    res.redirect('/?error=1');
  }
};
//--- Explicación: Este middleware valida la palabra secreta que el usuario introduce. Si es correcta, la almacena en la sesión y permite que la solicitud continúe (next()). Si no es correcta, redirige al usuario a la página de inicio con un error.


//Usado?: Sí
const setup = (app) => {
  app.get('/', (req, res) => {
    const mensajeError = req.query.error
      ? (req.query.error === '1' ? 'Palabra incorrecta, inténtalo de nuevo.' : 'No estás logado.')
      : '';
    if (req.session.palabraSecreta) {
      return res.redirect('/profile');
    }
    //Código
})}
//--- Explicación: Esta ruta muestra un formulario donde el usuario puede ingresar la palabra secreta. Si la palabra ya ha sido introducida correctamente (está en la sesión), redirige al perfil.


//Usado?: Sí
res.send(`
  <html>
    <body>
      <h1>Página de Inicio</h1>
      <p>${mensajeError}</p>
      <form method="post" action="/profile">
        <label for="palabra">Introduce la palabra:</label>
        <input type="text" name="palabra" required>
        <button type="submit">Enviar</button>
      </form>
    </body>
  </html>
`);
//--- Explicación: Aquí mostramos un mensaje de error si la palabra es incorrecta, que viene de la query (?error=1 o ?error=2).


const setupAPP = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({
    secret: 'secretoSuperSecreto',
    resave: false,
    saveUninitialized: true,
  }));
};

//--- Explicación: Esta función configura los middlewares para usar body-parser y session. Se puede llamar en app.js para centralizar la configuración.


//Usado?: Sí
app.post('/profile', middlewares.validarPalabraMiddleware, (req, res) => {
  res.send(`
    <h1>Ruta del Perfil</h1>
    <form method="post" action="/logout">
      <button type="submit">Log Out</button>
    </form>
  `);
});
//--- Explicación: Esta ruta maneja el envío del formulario con la palabra secreta. Si la palabra es correcta, redirige al perfil; si no, muestra un error.


//Usado?: No
app.use(bodyParser.urlencoded({ extended: true }));

//--- Explicación: Usamos body-parser para poder leer datos que nos envíen en el cuerpo de las solicitudes POST, como los datos del formulario.


//Usado?: No
app.use(session({
  secret: process.env.PALABRA_SECRETA || 'secretoSuperSecreto',
  resave: false,
  saveUninitialized: true,
}));

//--- Explicación: Configuramos la sesión del usuario. secret es una clave secreta que se usa para firmar la sesión. resave y saveUninitialized controlan el comportamiento de la sesión cuando no se modifican.


//Usado?: Sí
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
//--- Explicación: Inicia el servidor en el puerto definido y muestra un mensaje en la consola para indicar que el servidor está funcionando.


//Usado?: Sí
const verificarSesionMiddleware = (req, res, next) => {
  if (req.session.palabraSecreta) {
    next();
  } else {
    res.redirect('/?error=2');
  }
};
//--- Explicación: Este middleware verifica si el usuario tiene una sesión activa antes de permitir el acceso a la ruta /profile. Si no hay sesión activa, redirige al usuario a la página de inicio con un mensaje de error.


//Usado?: Sí
app.get('/profile', middlewares.verificarSesionMiddleware, (req, res) => {
  res.send(`
    <h1>Ruta del Perfil (Sesión activa)</h1>
    <form method="post" action="/logout">
      <button type="submit">Log Out</button>
    </form>
  `);
});
//--- Explicación: Esta ruta muestra la página de perfil cuando el usuario ha iniciado sesión correctamente. La función verificarSesionMiddleware verifica si el usuario tiene una sesión activa.


//Usado?: Sí
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
    }
    res.redirect('/');
  });
});
//--- Explicación: Esta ruta cierra la sesión del usuario y lo redirige a la página principal.

//Usado?: Sí
module.exports = {
  setup,
};
//--- Explicación: Exportamos la función setup para poder configurarla en otros archivos, como app.js.

//Usado?: Sí
module.exports = {
  validarPalabraMiddleware,
  verificarSesionMiddleware,
  setupAPP,
};
//--- Explicación: Exportamos los middlewares y configuraciones para que puedan ser utilizados en otras partes de la aplicación, como en app.js.
