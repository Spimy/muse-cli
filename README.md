# Muse (μ's) CLI

## THIS PROJECT HAS BEEN ABANDONED

I myself have made use of MuseCLI for a long time to create my own bots because it is very convenient to set some stuffs up. However, I have officially dropped support for this project. This will be archived very soon. Instead, please check out [@yor/core](https://github.com/Spimy/yor/tree/main/packages/core/) and [@yor/commands](https://github.com/Spimy/yor/tree/main/packages/commands/). The former is a Discord.JS wrapper while the latter is an optional module you can install for the wrapper.

A CLI is being worked on to make the setup easier as it does require quite a bit of initial boilerplate.

## MuseCLI
![Muse Logo Image](https://i.imgur.com/nUdeZsJ.png)\
[![Discord Users Online](https://discordapp.com/api/guilds/422469294786347016/widget.png?style=shield)](https://discord.gg/865tNC4)

<a href="https://www.buymeacoffee.com/officialspimy" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-blue.png" alt="Buy Me A Coffee" height="30.75" width="130.5"></a>

![npm](https://img.shields.io/npm/v/muse-cli)
![GitHub](https://img.shields.io/github/license/spimy/muse-cli)
![npm](https://img.shields.io/npm/dw/muse-cli)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/muse-cli)


MuseCLI generates a discord.js bot with music features for you. You can use the `generate` command to automatically generate boilerplate for commands and events so you don't have to keep re-writing the same code every time you create a new component.

**NOTICE:** If the bot crashes or music randomly gets skipped with errors similar to `Error: Too many redirects` then
the error comes from YTDL and I am not responsible for any issues related to said library. If any issues of the like
persists, open an issue on their [GitHub page](https://github.com/Snowflake107/discord-ytdl-core/issues/).

## Requirements

- [NodeJS](https://nodejs.org/)
- [FFmpeg](https://www.ffmpeg.org/)

## Commands

For more details, please check the [Wiki](https://github.com/Spimy/muse-cli/wiki)

- Start a new project:\
    `muse (n)ew <project-name> <template> [--git] [--skipInstall] [--packageManager=(NPM/yarn)]`
    
    Templates currently available: TypeScript

- Generate a new component: \
    `muse (g)enerate <component> <component_name>`

    Components available: `command` and `event`\
    Component name supports relative path, e.g: `admin/ban` will create a ban `command` inside the `admin` folder

## Features

<details>
<summary>Start Music</summary>

- Multiple Ways to Start Music:

    1. Play with YouTube video links (also supports YouTube playlist links):\
    ![Method 1](https://i.imgur.com/70rQ31v.png)

    1. Play with search query:\
    ![Method 2](https://i.imgur.com/k23pWTS.png)

    1. Play using search command to make a selection from 10 results:\
    ![Method 3](https://i.imgur.com/ZlR8drJ.png)

</details>


<details>
<summary>Music and Queue Loop</summary>

- You can loop the currently playing music or queue.

    If music is looping, it will never jump to the next music in the queue unless you turn if off or skip it\
    If queue is looping, the entire queue will never end.

    ![Loop command](https://i.imgur.com/4mO29KC.png)

</details>


<details>
<summary>Skipping music</summary>

- Vote Skip if not Admin:

    ![Skip command](https://i.imgur.com/cptf7OX.png)

</details>


<details>
<summary>Paginated Queue Embed</summary>

-   Each page contains up to 5 videos so you need at least 6 videos in the queue for pagination to start\
    The reactor for pagination lasts for 60 seconds. If 60 seconds have passed, rerun the `queue` command for
    pagination to work again

    ![Queue embed](https://i.imgur.com/vUa4YvY.gif)

</details>


<details>
<summary>Duration Bar</summary>

- Updates every 5 seconds to avoid rate limit\
    ![Duration bar](https://i.imgur.com/k2zqPvy.gif)

</details>


<details>
<summary>Queue and Video Clearing</summary>

- Clear the whole queue or a specific music at a specified index:\
    ![Clear queue](https://i.imgur.com/HNyBvCN.png)

</details>


<details>
<summary>Help Message</summary>

- Responsive Help Message:\
    Supports multiple prefixes too
    ![Help message](https://i.imgur.com/XMmiC48.png)

</details>


</details>


## Project Setup

### Installation Instructions

#### For Development

1. Run `npm install -g muse-cli` or `yarn global add muse-cli`
2. Run `muse new project-name typescript [--git] [--skipInstall] [--packageManager=(npm/yarn)]`

#### For Contribution

1. Fork this repo
2. Clone your fork to your local machine
3. CD into the muse-cli project root directory
4. Run `npm install` or `yarn`
5. Create a new branch and make your contribution
6. Make a pull request on GitHub for me to review

### Sensitive Information

You must at all cost keep your sensitive information like [Discord Bot Token](https://github.com/Spimy/muse-cli/wiki/Getting-a-Discord-Bot-Token) and [YouTube API Key](https://console.cloud.google.com/apis/library/youtube.googleapis.com?id=125bab65-cfb6-4f25-9826-4dcc309bc508) safe and the best way to do that is via environment variables. You can set them directly in your SYSTEM ENV, but setting them inside a `.env` file in your project root folder is recommended:
```
TOKEN=bot_token
YOUTUBE_API_KEY=api_key
```

## Command File Template

```js
@Command({
    name: '', // The name of the command
    aliases: [], // Add aliases inside the array (Optional)
    category: '', // Specify which category this command belongs to (Optional)
    usage: '', // Specify the arguments taken by the command (Optional)
    description: '', // A short description about your command (Optional)
    permissions: [], // Add permissions required to run the command (Optional)
    overrideDefaultPermCheck: false // Whether to ignore default permission check (Optional)
})
default class implements CommandExecutor {

    execute = async (message: Message, args: string[]): Promise<boolean> => {
        // Command code in here
        return true;
    }

}
```
OR

Use `muse generate command <command_name>` to generate boilerplate for a command

## Event File Template

```js
@Event('') // The name of the event
default class implements EventListener {

    listen = async (/* Pass in appropriate arguments for the event name passed in the decorator */) => {
        // Event code in here
    }

}
```
OR

Use `muse generate event <event_name>` to generate boilerplate for an event


## Author

I am Spimy, but my Discord is under a different name most of the time.
- Discord: Biribiri#6160
- [GitHub](https://github.com/Spimy)
- [YouTube Gaming](https://www.youtube.com/channel/UCNfE0E97k3fouJg-2nulLKg)
- [YouTube Development](https://www.youtube.com/channel/UCEw406qZnsdCEpRgVvCJzuQ)
- [Twitter](https://twitter.com/OfficialSpimy)

## Support Server

[![Support Server](https://discordapp.com/api/guilds/422469294786347016/widget.png?style=banner2)](https://discord.gg/865tNC4)
