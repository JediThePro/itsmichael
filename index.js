const Discord = require('discord.js');
const weather = require('weather-js');
const client = new Discord.Client();

const db = require('quick.db');
const active = new Map();
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
let token = 'NzY5ODY5NTI1MjI3MDEyMTE2.X5VS3g.bMcKgZeRqKLGMH7JN_grLwL9BP0';

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

client.on('message', async message => { 
    if (message.author.bot) return;
    
    // Check if Message is in a DM
    if (message.guild === null) {
        // Fetch Activity Info
        let active = await db.fetch(`support_${message.author.id}`);
        let guild = client.guilds.get('730717877056831528') // Your Server ID
        let channel, found = true;
        try {
            if (active) client.channels.get(active.channelID).guild;
        } catch(e) {
            found = false;
        }
        if (!active || !found) {
            // Create Support Channel.
            active = {};
            let modRoles = guild.roles.find("name", ""); // Find the Mod/Admin roles so only Admin/Mods will see the tickets. Add it in the quotes
            let everyone = guild.roles.find("name","@" + "everyone");
            let bot = guild.roles.find("name","Bot");
            channel = await guild.createChannel(`${message.author.username}-${message.author.discriminator}`);
                channel.setParent(''); // Management Category ID
                channel.setTopic(`_complete to close the Ticket | ModMail for ${message.author.tag} | ID: ${message.author.id}`);
                channel.overwritePermissions(modRoles, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                    MANAGE_CHANNELS: true
                });
                channel.overwritePermissions(everyone, {
                    VIEW_CHANNEL: false,
                });
                channel.overwritePermissions(bot, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                    MANAGE_CHANNELS: true
                }); // This will set the permissions so only Staff will see the ticket.
            let author = message.author;
            const newChannel = new Discord.RichEmbed()
                .setColor('36393E')
                .setAuthor(author.tag, author.displayAvatarURL)
                .setFooter('ModMail Ticket Created')
                .addField('User', author)
                .addField('ID', author.id);
            await channel.send(newChannel);
            
            const newTicket = new Discord.RichEmbed()
                .setColor('36393E')
                .setAuthor(`Hello, ${author.tag}`, author.displayAvatarURL)
                .setFooter('ModMail Ticket Created');
                
            await author.send(newTicket);
            
            // Update Active Data
            active.channelID = channel.id;
            active.targetID = author.id;
        }
        
        channel = client.channels.get(active.channelID);
        const dm = new Discord.RichEmbed()
            .setColor('36393E')
            .setAuthor(`Thank you, ${message.author.tag}`, message.author.displayAvatarURL)
            .setFooter(`Your message has been sent -- A staff member will be in contact soon.`);
            
        await message.author.send(dm);
        
        const embed = new Discord.RichEmbed()
            .setColor('36393E')
            .setAuthor(message.author.tag, message.author.displayAvatarURL)
            .setDescription(message.content)
            .setFooter(`Message Recieved -- ${message.author.tag}`);
            
        await channel.send(embed);
        db.set(`support_${message.author.id}`, active);
        db.set(`supportChannel_${channel.id}`, message.author.id);
        return;
    }
    
    let support = await db.fetch(`supportChannel_${message.channel.id}`);
    if (support) {
        support = await db.fetch(`support_${support}`);
        let supportUser = client.users.get(support.targetID);
        if (!supportUser) return message.channel.delete();
        
        // !complete command
        if (message.content.toLowerCase() === "_complete") {
            const complete = new Discord.RichEmbed()
                .setColor('36393E')
                .setAuthor(`Hey, ${supportUser.tag}`, supportUser.displayAvatarURL)
                .setFooter('Ticket Closed')
                .setDescription('*Your ModMail has been marked as **Complete**. If you wish to reopen this, or create a new one, please send a message to the bot.*');
                
            supportUser.send(complete);
            message.channel.delete()
                .then(console.log(`Support for ${supportUser.tag} has been closed.`))
                .catch(console.error);
            return db.delete(`support_${support.targetID}`);
        }
        const embed = new Discord.RichEmbed()
            .setColor('36393E')
            .setAuthor(message.author.tag, message.author.displayAvatarURL)
            .setFooter(`Message Recieved`)
            .setDescription(message.content);
            
        client.users.get(support.targetID).send(embed);
        message.delete({timeout: 1000});
        embed.setFooter(`Message Sent -- ${supportUser.tag}`).setDescription(message.content);
        return message.channel.send(embed);
    }


  // Variables
  let msg = message.content.toUpperCase(); // This takes the message.content, and turns it all uppercase.
  let sender = message.author; // This variable holds the message's author.
  let args = message.content.slice(prefix.length).trim().split(' '); // This variable takes the message.content, slices off the prefix from the front, then trims the blank spaces on the side, and turns it into an array by separating it by spaces.
  let cmd = args.shift().toLowerCase(); // This variable holds the first item from the args array, which is taken off of the args array and turned into lowercase.
 
  // Return Statements
  if (!msg.startsWith(prefix)) return; // If the message doesn't start with the prefix, exit the code.
 
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

client.login(token);
