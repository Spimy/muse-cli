const argumentImports = {
    channelCreate: 'GuildChannel',
    channelDelete: 'GuildChannel',
    channelPinsUpdate: 'GuildChannel, Date',
    channelUpdate: 'GuildChannel',
    debug: '',
    emojiCreate: 'GuildEmoji',
    emojiDelete: 'GuildEmoji',
    emojiUpdate: 'GuildEmoji',
    error: '',
    guildBanAdd: 'Guild, User',
    guildBanRemove: 'Guild, User',
    guildCreate: 'Guild',
    guildDelete: 'Guild',
    guildIntegrationsUpdate: 'Guild',
    guildMemberAdd: 'GuildMember',
    guildMemberRemove: 'GuildMember',
    guildMembersChunk: 'Collection, Snowflake, GuildMember, Guild',
    guildMemberSpeaking: 'GuildMember',
    guildMemberSpeaking: 'GuildMember, Speaking',
    guildMemberUpdate: 'GuildMember',
    guildUnavailable: 'Guild',
    guildUpdate: 'Guild',
    invalidated: '',
    inviteCreate: 'Invite',
    inviteDelete: 'Invite',
    message: 'Message',
    messageDelete: 'Message',
    messageDeleteBulk: 'Collection, Snowflake, Message',
    messageReactionAdd: 'MessageReaction, User',
    messageReactionRemove: ' MessageReaction, User',
    messageReactionRemoveAll: 'Message',
    messageReactionRemoveEmoji: 'MessageReaction',
    messageUpdate: 'Message',
    presenceUpdate: 'Presence',
    rateLimit: '',
    ready: '',
    roleCreate: 'Role',
    roleDelete: 'Role',
    roleUpdate: 'Role',
    shardDisconnect: '',
    shardError: '',
    shardReady: '',
    shardReconnecting: '',
    shardResume: '',
    typingStart: 'Channel, User',
    userUpdate: 'User',
    voiceStateUpdate: 'VoiceState',
    warn: '',
    webhookUpdate: 'TextChannel'
}

export const eventArguments = {
    channelCreate: 'channel: GuildChannel',
    channelDelete: 'channel: GuildChannel',
    channelPinsUpdate: 'channel: GuildChannel, time: Date',
    channelUpdate: 'oldChannel: GuildChannel, newChannel: GuildChannel',
    debug: 'info: string',
    emojiCreate: 'emoji: GuildEmoji',
    emojiDelete: 'emoji: GuildEmoji',
    emojiUpdate: 'oldEmoji: GuildEmoji, newEmoji: GuildEmoji',
    error: 'error: Error',
    guildBanAdd: 'guild: Guild, user: User',
    guildBanRemove: 'guild: Guild, user: User',
    guildCreate: 'guild: Guild',
    guildDelete: 'guild: Guild',
    guildIntegrationsUpdate: 'guild: Guild',
    guildMemberAdd: 'member: GuildMember',
    guildMemberRemove: 'member: GuildMember',
    guildMembersChunk: 'members: Collection<Snowflake, GuildMember>, guild: Guild',
    guildMemberSpeaking: 'member: GuildMember',
    guildMemberSpeaking: 'member: GuildMember, speaking: Readonly<Speaking>',
    guildMemberUpdate: 'oldMember: GuildMember, newMember: GuildMember',
    guildUnavailable: 'guild: Guild',
    guildUpdate: 'oldGuild: Guild, newGuild: Guild',
    invalidated: '',
    inviteCreate: 'invite: Invite',
    inviteDelete: 'invite: Invite',
    message: 'message: Message',
    messageDelete: 'message: Message',
    messageDeleteBulk: 'messages: Collection<Snowflake, Message>',
    messageReactionAdd: 'messageReaction: MessageReaction, user: User',
    messageReactionRemove: 'messageReaction: MessageReaction, user: User',
    messageReactionRemoveAll: 'message: Message',
    messageReactionRemoveEmoji: 'reaction: MessageReaction',
    messageUpdate: 'oldMessage: Message, newMessage: Message',
    presenceUpdate: 'oldPresence?: Presence, newPresence: Presence',
    rateLimit: 'rateLimitInfo: Object',
    ready: '',
    roleCreate: 'role: Role',
    roleDelete: 'role: Role',
    roleUpdate: 'oldRole: Role, newRole: Role',
    shardDisconnect: 'event: CloseEvent, id: number',
    shardError: 'error: Error, shardID: number',
    shardReady: 'id: number, unavailableGuilds?: Set<string>',
    shardReconnecting: 'id: number',
    shardResume: 'id: number, replayedEvents: number',
    typingStart: 'channel: Channel, user: User',
    userUpdate: 'oldUser: User, newUser: User',
    voiceStateUpdate: 'oldState: VoiceState, newState: VoiceState',
    warn: 'info: string',
    webhookUpdate: 'channel: TextChannel'
}

export const eventTemplate = (name, counter) => {
    const imports = argumentImports[name];
    const argument = eventArguments[name];
    const command =
        `
import { client } from '${'../'.repeat(counter)}index';
import { Event } from '${'../'.repeat(counter)}lib/events/Event';
import { EventListener } from '${'../'.repeat(counter)}lib/events/EventListener';
${imports !== '' ? `import { ${imports} } from 'discord.js'` : ''};

@Event('${name}')
default class implements EventListener {

    listen = async (${argument}) => {

    }

}
`
    return command;
}
