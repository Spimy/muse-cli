import { client } from '../../index';
import { EventType } from '../../types';
import { EventListener } from './EventListener';


export function Event(event: EventType) {

    return function (target: { new(): EventListener }) {
        client.on(event, new target().listen);
    }

}
