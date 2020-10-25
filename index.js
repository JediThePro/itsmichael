const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

let prefix = process.env.PREFIX;
let token = process.env.TOKEN;

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

client.login('NzY5ODY5NTI1MjI3MDEyMTE2.X5VS3g.bMcKgZeRqKLGMH7JN_grLwL9BP0');