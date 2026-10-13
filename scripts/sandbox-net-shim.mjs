// Preload shim for running Stryker in a socket-restricted shell (e.g. Claude
// Code's Seatbelt sandbox, which denies all socket binding). Stryker spins up a
// loopback logging server; the bind fails with EPERM and the run aborts. The
// logging channel is purely diagnostic — mutation results travel over Stryker's
// separate worker IPC — so neutralizing the socket here does not change the
// score. Loaded via `--import` in the `mutation:sandbox` script only; a normal
// terminal or CI should use plain `make mutation` (sandbox fully intact).
import net from 'node:net';
import { EventEmitter } from 'node:events';

const FAKE_PORT = 65000;
const soon = (cb) => Promise.resolve().then(cb);

const realCreateServer = net.createServer.bind(net);
net.createServer = (...args) => {
  const server = realCreateServer(...args);
  server.listen = function listen(...listenArgs) {
    const cb = listenArgs.find((a) => typeof a === 'function');
    if (cb) soon(cb);
    return server;
  };
  server.address = () => ({ port: FAKE_PORT, address: '127.0.0.1', family: 'IPv4' });
  server.close = (cb) => {
    if (typeof cb === 'function') soon(cb);
    return server;
  };
  return server;
};

function fakeSocket(connectListener) {
  const socket = new EventEmitter();
  socket.writable = true;
  socket.setEncoding = () => socket;
  socket.write = () => true;
  socket.end = (cb) => {
    if (typeof cb === 'function') soon(cb);
    return socket;
  };
  socket.destroy = () => socket;
  if (typeof connectListener === 'function') soon(connectListener);
  return socket;
}

net.createConnection = (...args) => fakeSocket(args.find((a) => typeof a === 'function'));
net.connect = net.createConnection;
