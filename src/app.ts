
import Server from './server';

console.log(new Date().toString(), 'Iniciando Servidor');
const server = new Server();
server.startHttp(3500);
