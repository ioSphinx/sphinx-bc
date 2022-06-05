const wait = require("node:timers/promises").setTimeout;

function botbc({token, ownerID , prefix, embedReply = "This broadcast bot was made by Sphinx#1100 it's not my responsebilty if you use it wrong", mention = true}) {
    
    const Discord = require("discord.js");
    const client = new Discord.Client({
        intents: 32767
    });
    if(!ownerID) {
        console.error(new Error("Second Argument is missing [ownerID], Array Argument"))
        return process.exit(0)
    } 
    if(!Array.isArray(ownerID)) {
        console.error(new Error("Second Argument is not an array"));
        return process.exit(0)
    }
        
    
    const row = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton().setCustomId('yes').setLabel("Send").setStyle('SUCCESS')
    ).addComponents(
        new Discord.MessageButton().setCustomId('no').setLabel("Decline").setStyle("DANGER")
    )

    

    
    client.on("ready", () => {
        console.log(`BroadCast is on for ${client.user.username}`)
    });

    client.on("messageCreate", async(message) => {
        if(!prefix) {
            console.error(new Error("Third Argument is missing [prefix], String Argument"))
            process.exit(0)
       }
        if(message.content.startsWith(prefix + "bc")) {
            if(ownerID) {
               
                if(!ownerID.includes(message.author.id)) return message.channel.send("You're not the owner")
            }
            const args = message.content.slice(prefix.length).trim().split(' ');
            let words = args.slice(1).join(" ");
            
            const filter = i => (i.customId === row.components[0].customId && i.user.id === message.author.id) ||
            (i.customId === row.components[1].customId && i.user.id === message.author.id);
            let msg = await message.channel.send({
                embeds: [new Discord.MessageEmbed().setTitle("Are you sure you want to send this broardCast?").setDescription(embedReply)],
                components: [row]
            });
            const collector = msg.createMessageComponentCollector({ filter, time: 20000});
            collector.on("collect", async i => {
                if(i.customId === row.components[0].customId) {
                    message.guild.members.cache.filter(m => m.presence?.status !== 'offline').forEach(m => {
                        if(m.presence) {
                            wait(5000);
                            m.send(mention ? `${words} \n \n ${m}` : words).then(m => {
                                console.log(m)
                                console.log(`Sent to ${m}`)
                            }).catch(m => {
                                console.log(`Err`)
                            })
                        }
        
                    });
                    await i.deferUpdate();
                    await wait(1000);
                    await i.editReply({ content: "Done", components: [], embeds: []})
                }
                if(i.customId === row.components[1].customId) {
                    await i.deferUpdate();
                    await wait(1000);
                    await i.editReply({
                        content: "Decliend",
                        components: [],
                        embeds: []
                    })
                }
            })

        }
    })

    client.login(token);
    
};



module.exports = {botbc}