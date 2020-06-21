# Muse (μ's)

![Muse Logo Image](assets/logo.png)\
[![Discord Users Online](https://discordapp.com/api/guilds/422469294786347016/widget.png?style=shield)](https://discord.gg/865tNC4)\
A discord.js bot template already containing music functions\
You can add to this bot by writing your own commands code and putting in the commands folder

**NOTICE:** If the bot crashes or song randomly gets skipped with errors similar to `Error: Too many redirects` then
the error comes from YTDL and I am not responsible for any issues related to said library. If any issues of the like
persists, open an issue on their [GitHub page](https://github.com/Snowflake107/discord-ytdl-core/issues/).

## Requirements

- NodeJS
- FFmpeg

### NodeJS

You are required to have NodeJS installed.\
If you do not have NodeJS installed, download it at <https://nodejs.org/> and run the installer.
Once installed, open your command line and run `node -v` to check if it has been properly installed.\
You must be running at least V12 of NodeJS!

### FFmpeg

You are required to have FFmpeg installed on your machine to play music.\
If you do not have FFmpeg installed, download it at <https://www.ffmpeg.org/>.

Extract the downloaded files into your C: drive and set up your `PATH` environment variable to the
`bin` folder. Once you have done this, close and reopen your command line if you already have it
opened and run `ffmpeg -version` to check if it has been properly installed.

Watch [Linux Leech's Video](https://www.youtube.com/watch?v=qjtmgCb8NcE) if you still need help
installing FFmpeg.

## Installation Instructions

- Fork this repo
- Clone your fork to your local machine
- CD into the bot's root directory
- Run `npm install` or `yarn`
- Copy your [discord token](#getting-a-discord-bot-token) and set a command prefix in into [muse.json](muse.json)
- Run `npm build` or `yarn build` or `tsc -b`
- Run `npm dev` or `yarn dev` and if you do, skip the next step
- Run `npm start` or `yarn start` or `node dist/index.js`

OR

- Run `npm install -g muse-cli` or `yarn global add muse-cli`
- Run `muse new project-name typescript [--git] [--skipInstall] [--packageManager=(npm/yarn)]`
- Copy your [discord token](#getting-a-discord-bot-token) and set a command prefix in into [muse.json](muse.json)

## Getting a Discord Bot Token

- Head on over to [Discord's Developer Page](https://discordapp.com/developers/applications/)
- Sign in with your Discord account, if you are not already signed in
- Click the "New Application" button
- Give the application a name
- On the "General Information" Tab, give your application an avatar image
- Click the bot tab on the left hand side menu
- Then click "Add Bot" & confirm by clicking "Yes, Do it"
- Finally, copy the bot token

Note: Do NOT share your bot token with anyone!

![Bot Token Tutorial Image](./assets/bot_token_tutorial.png)

## Features

- Multiple Ways to Start Music:
    1. Play with YouTube video links (also supports YouTube playlist links):\
    ![Method 1](assets/features/play_command/method_1.png)

    1. Play with search query:\
    ![Method 2](assets/features/play_command/method_2.png)

    1. Play using search command to make a selection from 10 results:\
    ![Method 3](assets/features/play_command/method_3.png)

- Video and Queue Loop:\
    You can make a video or a queue loop.

    If video is looping, it will never jump to the next video unless you turn if off or skip the song\
    If queue is looping, the entire queue will never end. This is done by pushing the current video to the
    end of the queue array when it finishes playing

    ![Loop command](assets/features/loop_command.png)

- Vote Skip if not Admin:\
    ![Skip command](assets/features/skip_command.png)

- Paginated Queue Embed:\
    Each page contains up to 5 videos so you need at least 6 videos in the queue for pagination to start\
    The reactor for pagination lasts for 60 seconds. If 60 seconds have passed, rerun the `queue` command for
    pagination to work again\
    ![Queue embed](assets/features/queue_embed.gif)

- Duration Bar:\
    Updates every 5 seconds to avoid rate limit\
    ![Duration bar](assets/features/duration_bar.gif)

- Clear Whole Queue or Video at Specified Index:\
    ![Clear queue](assets/features/clear_command.png)

- Responsive Help Message:\
    ![Help message](assets/features/help_message.png)

## Command File Template

```js
@Command({
    name: '', // The name of the command
    aliases: [], // Add aliases inside the array (Optional)
    category: '', // Specify which category this command belongs to (Optional)
    usage: '', // Specify the arguments taken by the command (Optional)
    description: '', // A short description about your command (Optional)
    permissions: [] // Add permissions required to run the command (Optional)
})
default class implements CommandExecutor {

    execute = async (message: Message, args: string[]): Promise<boolean> => {
        // Command code in here
        return true;
    }

}
```

## Author

[Spimy:](https://github.com/Spimy)

- Discord: Biribiri#6160
- YouTube: <https://www.youtube.com/channel/UCNfE0E97k3fouJg-2nulLKg>
- Twitter: <https://twitter.com/OfficialSpimy>
- Instagram: <http://instagram.com/OfficialSpimy>

## Support Server

[![Support Server](https://discordapp.com/api/guilds/422469294786347016/widget.png?style=banner2)](https://discord.gg/865tNC4)
