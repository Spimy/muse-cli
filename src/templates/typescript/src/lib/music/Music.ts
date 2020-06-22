import { GuildMember } from "discord.js";

export interface Music {

    title: string;
    url: string;
    thumbnail: string;
    duration: number;
    paused: boolean;
    loop: boolean;
    author: string,
    authorUrl: string,
    votes: GuildMember[];
    requester: GuildMember;

}