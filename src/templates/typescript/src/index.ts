require('dotenv').config();
import MuseClient from './lib/client';

export const client = new MuseClient();
client.login(process.env.TOKEN!);