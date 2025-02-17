const bodyParser = require('body-parser'); // Usamos body-parser para analizar los datos enviados en el cuerpo de las solicitudes HTTP. Necesitamos esto para procesar correctamente los datos del formulario.
const session = require('express-session'); // Para gestionar las sesiones de los usuarios, lo cual permite almacenar información entre diferentes solicitudes.
const dotenv = require('dotenv'); // Nos permite cargar variables de entorno desde un archivo .env, como la palabra secreta.


dotenv.config(); // Este comando carga las variables de entorno definidas en el archivo .env en el entorno de Node.js. Aquí es donde se encuentra la palabra secreta que el usuario tiene que adivinar.

const setupAPP = (app) => { // Esta función configura los middlewares para usar body-parser y session. Se puede llamar en app.js para centralizar la configuración.
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({
    secret: 'secretoSuperSecreto',
    resave: false,
    saveUninitialized: true,
  }));
};  


const validarPalabraMiddleware = (req, res, next) => { 
  console.log(req.body); // Asegúrate de que esto imprima lo esperado, para ver si el cuerpo llega correctamente

  const palabraCorrecta = process.env.PALABRA_SECRETA || ''; 

  if (req.body && req.body.palabra === palabraCorrecta) {
    req.session.palabraSecreta = req.body.palabra;
    next(); 
  } else {
    res.redirect('/?error=1'); // Redirige si la palabra es incorrecta
  }
};

const verificarSesionMiddleware = (req, res, next) => {
  if (req.session && req.session.palabraSecreta) {
    next();
  } else {
    res.redirect('/?error=2'); 
  }
};



module.exports = {   // Exportamos los middlewares y configuraciones para que puedan ser utilizados en otras partes de la aplicación, como en app.js.
  setupAPP,
  validarPalabraMiddleware,
  verificarSesionMiddleware
};
