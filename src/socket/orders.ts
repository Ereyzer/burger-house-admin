import { io } from 'socket.io-client';
import { store } from '../store';
import { pushNewOrder } from '../store/reducers/orders.reducer';
import soundFile from '../assets/sounds/tune1.wav';
import { BaseApi } from '../api/initial-class';

const SOCKET_URL = 'http://localhost:3000/orders';

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: false, // TODO: check if need for reconect?
  // query: { token: `Bearer ${BaseApi.instance.token}` },
  auth: {
    token: `Bearer ${BaseApi.instance.token}`,
  },
  // extraHeaders: {
  //   Authorization: token,
  // },
});

socket.on('connect', () => {
  console.log(' Connected to WebSocket: ', socket.id);
  //   store.dispatch();
});

socket.on('disconnect', () => {
  console.log(' Disconnected from WebSocket');
  // store.dispatch(setConnected(false));
});

socket.on('newOrderCreated', order => {
  const audio = new Audio(soundFile);
  audio.play().catch(err => {
    console.log(err);
  });
  store.dispatch(pushNewOrder(order));
});

socket.on('tokenExpired', async () => {
  console.log('tokenExpired');
  await BaseApi.instance.getAndUpdateToken();
  socket.auth = {
    token: `Bearer ${BaseApi.instance.token}`,
  };
  socket.emit('checkFreshToken', { token: `Bearer ${BaseApi.instance.token}` });
});

socket.on('error', error => {
  console.warn(' Socket error:', error);
});

export { socket };
