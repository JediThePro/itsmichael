const Discord = require('discord.js');
const weather = require('weather-js');
const client = new Discord.Client();

const db = require('quick.db');
let ownerID = '696211031579688971';

const moment = require('moment'),
      m = require('moment-duration-format');

client.on('ready', async () => {
  function randomStatus() {
        let status = ['Michaelhu0925', 'Official ItsMichael Community', 'bots','someone'] // You can change it whatever you want.
        let rstatus = Math.floor(Math.random() * status.length);
        
        client.user.setActivity(status[rstatus], {type: 'WATCHING'});
      }; setInterval(randomStatus, 8000)
  
  console.log(`Logged in as ${client.user.tag}!`);
});

let prefix = '>';

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  
  if (message.content.startsWith(prefix + 'prune') || message.content.startsWith(prefix + 'purge')) {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    
    // Embeds
    const prunePerms = new Discord.MessageEmbed()
    .setColor(0xda7272)
    .setTimestamp()
    .setTitle('Error!')
    .setDescription('You don\'t have any permissions to run this command \n**Required Permissions**: `MANAGE_MESSAGES` and `ADMINISTRATOR`')
    
    const pruneBotPerms = new Discord.MessageEmbed()
    .setColor(0xda7272)
    .setTimestamp()
    .setTitle('Error!')
    .setDescription('I don\'t have permissions to run this command \n**Required Permissions:** `MANAGE_MESSAGES` and `ADMINISTRATOR`')
    
    const pruneIsNaN = new Discord.MessageEmbed()
    .setColor(0xda7272)
    .setTimestamp()
    .setTitle('Error!')
    .setDescription('Please input a valid number')
    
    const pruneLess100 = new Discord.MessageEmbed()
    .setColor(0xda7272)
    .setTimestamp()
    .setTitle('Error!')
    .setDescription('Insert the number less than 100')
    
    const pruneMore1 = new Discord.MessageEmbed()
    .setColor(0xda7272)
    .setTimestamp()
    .setTitle('Error!')
    .setDescription('Insert the number more than 1')
    
    if (!message.member.hasPermission('ADMINISTRATOR') || !message.member.hasPermission('MANAGE_MESSAGES')) return message.reply(prunePerms);
    if (!message.guild.me.hasPermission('ADMINISTRATOR') || !message.guild.me.hasPermission('MANAGE_MESSAGES')) return message.reply(pruneBotPerms);
    if (isNaN(args[0])) return message.channel.send(pruneIsNaN) // isNaN = is Not a Number. (case sensitive, write it right)
    if (args[0] > 100) return message.channel.send(pruneLess100) // Discord limited purge number into 100.
    if (args[0] < 2) return message.channel.send(pruneMore1)
    
    const pruneErr = new Discord.MessageEmbed()
    .setColor(0xda7272)
    .setTimestamp()
    .setTitle('Something went wrong!')
    .setDescription('Something went wrong, while deleting messages')
    
    await message.delete()
    await message.channel.bulkDelete(args[0])
    .then(messages => message.channel.send(`Deleted ${messages.size}/${args[0]} messages.`)).then(d => d.delete({timeout: 10000})) // How long this message will be deleted (in ms)
    .catch(() => message.channel.send(pruneErr))
  }
})

client.on('message', async (message) => {
    if (message.author.bot) return;
    
  
    if (message.content.startsWith(prefix + 'slowmode') || message.content.startsWith(prefix + 'slow')) {
        const permissionslow = new Discord.MessageEmbed()
        .setColor(0xda7272)
        .setTimestamp()
        .setDescription('You don\'t have permissions to run this command')
        .setTitle('Error!')
      
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply(permissionslow);
      
        const { channel } = message

        const args = message.content.slice(prefix.length).trim().split(/ +/g);

        const time = message.content.split(' ').slice(1).join(' ');
        if (!time) return message.reply({embed: {color: 0xda7272, description: `Please provide the slowmode duration.`}})
        message.channel.setRateLimitPerUser(time)
        message.reply({embed: {color: 0x7289da, description: `The slowmode has been set to **${time}**!`}}).then(m => m.delete({
            timeout: 5000
        }))
    }
});

client.on('message', async (message) => {
  if (message.author.bot) return;
  
  if (message.content.startsWith(prefix + 'userinfo') || message.content.startsWith(prefix + 'ui')) {
    let user = message.mentions.users.first() || message.author;
    
    if (user.presence.status === "dnd") user.presence.status = "Do Not Disturb";
    if (user.presence.status === "idle") user.presence.status = "Idle";
    if (user.presence.status === "offline") user.presence.status = "Offline";
    if (user.presence.status === "online") user.presence.status = "Online";
    
    function game() {
      let game;
      if (user.presence.activities.length >= 1) game = `${user.presence.activities[0].type} ${user.presence.activities[0].name}`;
      else if (user.presence.activities.length < 1) game = "None"; // This will check if the user doesn't playing anything.
      return game; // Return the result.
    }
    
    let x = Date.now() - user.createdAt; // Since the user created their account.
    let y = Date.now() - message.guild.members.cache.get(user.id).joinedAt; // Since the user joined the server.
    let created = Math.floor(x / 86400000); // 5 digits-zero.
    let joined = Math.floor(y / 86400000);
    
    const member = message.guild.member(user);
    let nickname = member.nickname !== undefined && member.nickname !== null ? member.nickname : "None";
    let createdate = moment.utc(user.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss"); // User Created Date
    let joindate = moment.utc(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss"); // User Joined the Server Date
    let status = user.presence.status;
    let avatar = user.avatarURL({size: 2048}); // Use 2048 for high quality avatar.
    
    const uiResults = new Discord.MessageEmbed()
    .setAuthor(user.tag, avatar)
    .setThumbnail(avatar)
    .setTimestamp()
    .setColor(0x7289DA)
    .addField("ID", user.id, true)
    .addField("Nickname", nickname, true)
    .addField("Created Account Date", `${createdate} \nsince ${created} day(s) ago`, true)
    .addField("Joined Guild Date", `${joindate} \nsince ${joined} day(s) ago`, true)
    .addField("Status", status, true)
    .addField("Game", game(), true)
    
    message.channel.send(uiResults); // Let's see if it's working.
  }
});

client.on('message', async (message) => {
  if (message.author.bot) return;
  
  if (message.content === (prefix + 'ping')) {
    const pingEmbed = new Discord.MessageEmbed()
      .setColor(0x7289da)
      .setTimestamp()
      .setTitle(':ping_pong: Pong')
      .addFields(
        {
          name: '**API:**',
          value: `**${client.ws.ping}**ms`
        },
        {
          name: '**Latency:**',
          value: `**${Date.now() - message.createdTimestamp}**ms`
        }
      )
    message.reply(pingEmbed);
  }
});

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  
  if (message.content.startsWith(prefix + 'kick')) {
    const kickPerms = new Discord.MessageEmbed()
    .setColor(0xda7272)
    .setTimestamp()
    .setTitle('Error!')
    .setDescription('You don\'t have permissions to run this command')
    
    const kickBotPerms = new Discord.MessageEmbed()
    .setColor(0xda7272)
    .setTimestamp()
    .setTitle('Error!')
    .setDescription('I don\'t have permissions to run this command: \n**Required Permissions**: `KICK_MEMBERS`')
    
    if (!message.member.hasPermission('KICK_MEMBERS')) return message.reply(kickPerms);
    if (!message.guild.me.hasPermission('KICK_MEMBERS')) return message.reply(kickBotPerms);
    let user = message.mentions.users.first();
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    let member = message.guild.member(user);
    let reason = args.slice(1).join(" ");
    
    const kickMention = new Discord.MessageEmbed()
    .setColor(0xda7272)
    .setTimestamp()
    .setTitle('Error!')
    .setDescription('Please mention the user to kick')
    
    const kickSelf = new Discord.MessageEmbed()
    .setColor(0xda7272)
    .setTimestamp()
    .setTitle('Error!')
    .setDescription('You can\'t kick yourself')
    
    const kickBotself = new Discord.MessageEmbed()
    .setColor(0xda7272)
    .setTimestamp()
    .setTitle('Error!')
    .setDescription('You can\'t kick me')
    
    if (!user) return message.channel.send(kickMention);
    if (user.id === message.author.id) return message.channel.send(kickSelf);
    if (user.id === client.user.id) return message.channel.send(kickBotself);
    
    if (!reason) reason = "No reason provided";
    
    member.kick(reason).then(() => {
      const kicked = new Discord.MessageEmbed()
      .setColor(0x7289da)
      .setTimestamp()
      .setTitle('Kicked!')
      .setDescription(`Successfully kicked **${user.tag}**`)
      
      message.channel.send(kicked)
    }).catch(err => {
      const kickUnable = new Discord.MessageEmbed()
      .setColor(0xda7272)
      .setTimestamp()
      .setTitle('Error!')
      .setDescription('I was unable to kick the member')
      
      message.reply(kickUnable);
    })
  }
});

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  
  if (message.content.startsWith(prefix + 'ban')) {
    const banPerms = new Discord.MessageEmbed()
    .setColor(0xda7272)
    .setTimestamp()
    .setTitle('Error!')
    .setDescription('You don\'t have permissions to run this command')
    
    const banBotPerms = new Discord.MessageEmbed()
    .setColor(0xda7272)
    .setTimestamp()
    .setTitle('Error!')
    .setDescription('I don\'t have permissions to run this command: \n**Required Permissions**: `BAN_MEMBERS`')
    
    if (!message.member.hasPermission('BAN_MEMBERS')) return message.reply(banPerms);
    if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.reply(banBotPerms);
    let user = message.mentions.users.first();
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    let member = message.guild.member(user);
    let reason = args.slice(1).join(" ");
    
    const banMention = new Discord.MessageEmbed()
    .setColor(0xda7272)
    .setTimestamp()
    .setTitle('Error!')
    .setDescription('Please mention the user to ban')
    
    const banSelf = new Discord.MessageEmbed()
    .setColor(0xda7272)
    .setTimestamp()
    .setTitle('Error!')
    .setDescription('You can\'t ban yourself')
    
    const banBotself = new Discord.MessageEmbed()
    .setColor(0xda7272)
    .setTimestamp()
    .setTitle('Error!')
    .setDescription('You can\'t ban me')
    
    if (!user) return message.channel.send(banMention);
    if (user.id === message.author.id) return message.channel.send(banSelf);
    if (user.id === client.user.id) return message.channel.send(banBotself);
    
    if (!reason) reason = "No reason provided";
    
    member.ban(reason).then(() => {
      const banned = new Discord.MessageEmbed()
      .setColor(0x7289da)
      .setTimestamp()
      .setTitle('Banned!')
      .setDescription(`Successfully banned **${user.tag}**`)
      
      message.channel.send(banned)
    }).catch(err => {
      const banUnable = new Discord.MessageEmbed()
      .setColor(0xda7272)
      .setTimestamp()
      .setTitle('Error!')
      .setDescription('I was unable to ban the member')
      
      message.reply(banUnable);
    })
  }
});

client.login('TOKEN');
