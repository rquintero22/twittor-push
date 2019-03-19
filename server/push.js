
const fs = require('fs');

const urlsafeBase64 = require('urlsafe-base64');
const vapid = require('./vapid.json');
const webpush = require('web-push');

webpush.setVapidDetails(
    'mailto:quinteroaparicio@gmail.com',
    vapid.publicKey,
    vapid.privateKey
);


let subscriptions = require('./subs-db.json');

module.exports.getKey = () => {
    return urlsafeBase64.decode( vapid.publicKey );
}

module.exports.addSubscription = ( subscription ) => {

    subscriptions.push( subscription );

    fs.writeFileSync(`${ __dirname }/subs-db.json`, JSON.stringify(subscriptions));

}

module.exports.sendPush = ( post ) => {

    const notificacionesEnviadas = [];

    subscriptions.forEach( (subscription, i) => {
        
        const pushProm = webpush.sendNotification(subscription, JSON.stringify( post ) )
            .then(console.log('Notificación enviada'))
            .catch( err => {
                console.log('Notificación falló');
                if ( err.statusCode === 410 ) {
                    subscriptions[i].borrar = true;
                }
            });
        
        notificacionesEnviadas.push( pushProm );

    });

   Promise.all( notificacionesEnviadas ).then( () => {
       subscriptions = subscriptions.filter( subs => !subs.borrar );

       fs.writeFileSync(`${ __dirname }/subs-db.json`, JSON.stringify(subscriptions));
       
   });



}