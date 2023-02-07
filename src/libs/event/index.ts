import EventEmitter from 'eventemitter3';

export const emitter = new EventEmitter();

export enum emitterEvent {
  authChange = 'AUTH_CHANGE',
  refresh = 'REFRESH'
}
