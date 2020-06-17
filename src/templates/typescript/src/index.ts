require('dotenv').config();
import MuseClient from './lib/MuseClient';

export const client = new MuseClient();
client.login(process.env.TOKEN!);