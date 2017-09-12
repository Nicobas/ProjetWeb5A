var nconf = require('nconf');

nconf.set('environment', 'dev');

nconf.set('database', 'mongodb://localhost:27017/projetWeb5A');

nconf.set('default_token_size', 512);

nconf.set('authorization_token_duration', 15778800); // = 1h
nconf.set('refresh_token_duration', 15778800); //= 6 mois

nconf.set('api_server_port', 4000);

nconf.set('public_directory_path', '/home/nicobas/IntelliJIDEAProjects/ProjetWebS5/client/');

nconf.set('ssl_key_path', 'server/ssl/key.pem');
nconf.set('ssl_cert_path', 'server/ssl/cert.pem');
nconf.set('ssl_ca_path', 'server/ssl/cert.pem');