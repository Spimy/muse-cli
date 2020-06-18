import { GuildMember } from "discord.js";

export interface Music {

    title: string;
    url: string;
    thumbnail: string;
    duration: number;
    loop: boolean;
    requester: GuildMember;

}