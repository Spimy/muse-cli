export const events = {
    channelCreate: {
        imports: 'GuildChannel',
        args: 'channel: GuildChannel'
    },
    channelDelete: {
        imports: 'GuildChannel',
        args: 'channel: GuildChannel'
    },
    channelPinsUpdate: {
        imports: 'GuildChannel',
        args: 'channel: GuildChannel, time: Date'
    },
    channelUpdate: {
        imports: 'GuildChannel',
        args: 'oldChannel: GuildChannel, newChannel: GuildChannel'
    },
    debug: {
        imports: '',
        args: 'info: string'
    },
    emojiCreate: {
        imports: 'GuildEmoji',
        args: 'emoji: GuildEmoji'
    },
    emojiDelete: {
        imports: 'GuildEmoji',
        args: 'emoji: GuildEmoji'
    },
    emojiUpdate: {
        imports: 'GuildEmoji',
        args: 'oldEmoji: GuildEmoji, newEmoji: GuildEmoji'
    },
    error: {
        imports: '',
        args: 'error: Error'
    },
    guildBanAdd: {
        imports: 'Guild, User',
        args: 'guild: Guild, user: User'
    },
    guildBanRemove: {
        imports: 'Guild, User',
        args: 'guild: Guild, user: User'
    },
    guildCreate: {
        imports: 'Guild',
        args: 'guild: Guild'
    },
    guildDelete: {
        imports: 'Guild',
        args: 'guild: Guild'
    },
    guildIntegrationsUpdate: {
        imports: 'Guild',
        args: 'guild: Guild'
    },
    guildMemberAdd: {
        imports: 'GuildMember',
        args: 'member: GuildMember'
    },
    guildMemberRemove: {
        imports: 'GuildMember',
        args: 'member: GuildMember'
    },
    guildMembersChunk: {
        imports: 'Collection, Snowflake, GuildMember, Guild',
        args: 'members: Collection<Snowflake, GuildMember>, guild: Guild'
    },
    guildMemberSpeaking: {
        imports: 'GuildMember',
        args: 'member: GuildMember'
    },
    guildMemberSpeaking: {
        imports: 'GuildMember, Speaking',
        args: 'member: GuildMember, speaking: Readonly<Speaking>'
    },
    guildMemberUpdate: {
        imports: 'GuildMember',
        args: 'oldMember: GuildMember, newMember: GuildMember'
    },
    guildUnavailable: {
        imports: 'Guild',
        args: 'guild: Guild'
    },
    guildUpdate: {
        imports: 'Guild',
        args: 'oldGuild: Guild, newGuild: Guild'
    },
    invalidated: {
        imports: '',
        args: ''
    },
    inviteCreate: {
        imports: 'Invite',
        args: 'invite: Invite'
    },
    inviteDelete: {
        imports: 'Invite',
        args: 'invite: Invite'
    },
    message: {
        imports: 'Message',
        args: 'message: Message'
    },
    messageDelete: {
        imports: 'Message',
        args: 'message: Message'
    },
    messageDeleteBulk: {
        imports: 'Collection, Snowflake, Message',
        args: 'messages: Collection<Snowflake, Message>'
    },
    messageReactionAdd: {
        imports: 'MessageReaction, User',
        args: 'messageReaction: MessageReaction, user: User'
    },
    messageReactionRemove: {
        imports: 'MessageReaction, User',
        args: 'messageReaction: MessageReaction, user: User'
    },
    messageReactionRemoveAll: {
        imports: 'Message',
        args: 'message: Message'
    },
    messageReactionRemoveEmoji: {
        imports: 'MessageReaction',
        args: 'reaction: MessageReaction'
    },
    messageUpdate: {
        imports: 'Message',
        args: 'oldMessage: Message, newMessage: Message'
    },
    presenceUpdate: {
        imports: 'Presence',
        args: 'oldPresence?: Presence, newPresence: Presence'
    },
    rateLimit: {
        imports: '',
        args: 'rateLimitInfo: Object'
    },
    ready: {
        imports: '',
        args: ''
    },
    roleCreate: {
        imports: 'Role',
        args: 'role: Role'
    },
    roleDelete: {
        imports: 'Role',
        args: 'role: Role'
    },
    roleUpdate: {
        imports: 'Role',
        args: 'oldRole: Role, newRole: Role'
    },
    shardDisconnect: {
        imports: 'CloseEvent',
        args: 'event: CloseEvent, id: number'
    },
    shardError: {
        imports: '',
        args: 'error: Error, shardID: number'
    },
    shardReady: {
        imports: '',
        args: 'id: number, unavailableGuilds?: Set<string>'
    },
    shardReconnecting: {
        imports: '',
        args: 'id: number'
    },
    shardResume: {
        imports: '',
        args: 'id: number, replayedEvents: number'
    },
    typingStart: {
        imports: 'Channel, User',
        args: 'channel: Channel, user: User'
    },
    userUpdate: {
        imports: 'User',
        args: 'oldUser: User, newUser: User'
    },
    voiceStateUpdate: {
        imports: 'VoiceState',
        args: 'oldState: VoiceState, newState: VoiceState'
    },
    warn: {
        imports: '',
        args: 'info: string'
    },
    webhookUpdate: {
        imports: 'TextChannel',
        args: 'channel: TextChannel'
    }
}

export const eventTemplate = (name, counter) => {
    const { imports, args } = events[name];
    const command =
        `
import { client } from '${'../'.repeat(counter)}index';
import { Event } from '${'../'.repeat(counter)}lib/events/Event';
import { EventListener } from '${'../'.repeat(counter)}lib/events/EventListener';
${imports !== '' ? `import { ${imports} } from 'discord.js'` : ''};

@Event('${name}')
default class implements EventListener {

    listen = async (${args}) => {

    }

}
`
    return command;
}