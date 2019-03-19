// Routes.js - Módulo de rutas
const express = require('express');
const router = express.Router();
const push = require('./push');


const mensajes = [
  { _id: 'XXX',
    user: 'Spiderman',
    mensaje: 'Hola mundo'
  }
];




// Get mensajes
router.get('/', function (req, res) {
  // res.json('Obteniendo mensajes');
  res.json( mensajes );
});


// Post mensajes
router.post('/', function (req, res) {
  const mensaje = {
      mensaje: req.body.mensaje,
      user: req.body.user
  };

  mensajes.push( mensaje );

  res.json({
    ok: true,
    mensaje
  });

});

//Almacenar la subscripción
router.post('/subscribe', (req, res) => {

  const subscription = req.body;

  push.addSubscription( subscription );

  res.json('subscribe');
});

//Obtener la llave
router.get('/key', (req, res) => {
  const key = push.getKey();

  res.send(key);
});

//Enviar  una notificación push a todas las personas
// que se desee
router.post('/push', (req, res) => {

  const post = {
    titulo: req.body.titulo,
    cuerpo: req.body.cuerpo,
    usuario: req.body.usuario
  };


  push.sendPush( post );

  res.json(post);
});

module.exports = router;