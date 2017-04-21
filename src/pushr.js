const Pusher =  require('pusher');
import config from '../config';

export default new class Pushr {
    constructor() {
        this.pusher = new Pusher({
            appId: config.pusherAppId,
            key: config.pusherKey,
            secret: config.pusherSecret,
        });
    }

    trigger(channel, event, payload) {
        this.pusher.trigger(channel, event, payload);
    }
}