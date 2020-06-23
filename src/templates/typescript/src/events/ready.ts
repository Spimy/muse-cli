import { client } from '../index';
import { Event } from '../lib/events/Event';
import { EventListener } from '../lib/events/EventListener';

@Event('ready')
default class implements EventListener {

    listen = async () => {

        client.user?.setPresence({
            activity: {
                name: `with ${client.users.cache.get(client.$config.ownerID)?.username}`,
                type: 'PLAYING'
            },
            status: "dnd"
        });

        console.log(`${client.user!.tag} is now ready to be commanded.`);

    }

}