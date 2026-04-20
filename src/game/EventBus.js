import { Events } from 'phaser';

// EventBus serve como ponte segura entre o React e o Contexto WebGL do Phaser.
// Usado para notificar o React quando algo importante ocorrer no jogo (ex: Moedas coletadas),
// ou notificar o Phaser de ações no UI (ex: Comprou um item na loja da Aba Finanças).
export const EventBus = new Events.EventEmitter();
