const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const welcomeMessageSchema = require('../../schemas/welcomeMessageDB');
const customEmbedColorSchema = require('../../schemas/customEmbedColorDB');

module.exports = {
    name: 'welcome-message',
    description: `Configurer le message de bienvenue de votre serveur`,
    data: new SlashCommandBuilder()
        .setName('welcome-message')
        .setDescription("Configurer le message de bienvenue de votre serveur")
        .addSubcommand(create => create
            .setName('create')
            .setDescription('Créer votre salon de bienvenue')
            .addChannelOption(channel => channel
                .setName('channel')
                .setDescription('Spécifiez le salon dans lequel vous souhaitez le message')
                .setRequired(true)))
        .addSubcommand(remove => remove
            .setName('remove')
            .setDescription('Enlever le message de bienvenue')),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || !interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return await interaction.reply({
                content: "**[❌]** Vous avez besoin de la permission `GÉRER LE SERVEUR` ou `ADMNISTRATEUR` pour utiliser cette commande !",
                ephemeral: true
            });
        }

        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case 'create':
                const channel = interaction.options.getChannel('channel');
                const welcomedata = await welcomeMessageSchema.findOne({ Guild: interaction.guild.id });

                if (welcomedata) {
                    return interaction.reply({
                        content: `**[❌]** **Vous possédez déjà** un salon de bienvenue !\n 🔎 <#${welcomedata.Channel}> \n\n>>> Faites la commande **/welcome remove** pour le supprimer.`,
                        ephemeral: true
                    });
                } else {
                    await welcomeMessageSchema.create({
                        Guild: interaction.guild.id,
                        Channel: channel.id
                    });

                    const customEmbedColor = await customEmbedColorSchema.findOne({ Guild: interaction.guild.id });

                    const embed = new EmbedBuilder()
                        .setColor(`#${customEmbedColor ? customEmbedColor.Color : "000000"}`)
                        .setTitle(`🎉 Votre salon de bienvenue a été créer avec succès !`)
                        .setAuthor({
                            name: `ASGARD - SALON DE BIENVENUE`,
                            iconURL: 'https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png',
                            url: 'https://discord.com'
                        })
                        .setFooter({
                            text: 'Asgard © 2023 | Pour toute information, faites la commande /botinfo'
                        })
                        .setFields({ name: `• Salon créer avec succès`, value: `> 🔎 Le salon ${channel} est maintenant un salon de bienvenue !`, inline: false })
                        .addFields({ name: `⚡ Pour supprimer le salon de bienvenue`, value: `> 📝 Faites la commande **/welcome-message remove**` });

                    await interaction.reply({ embeds: [embed] });
                }
                break;

            case 'remove':
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || !interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
                    return await interaction.reply({
                        content: "**[❌]** Vous avez besoin de la permission `GÉRER LE SERVEUR` ou `ADMNISTRATEUR` pour utiliser cette commande !",
                        ephemeral: true
                    });
                }

                const leavedata = await welcomeMessageSchema.findOne({ Guild: interaction.guild.id });
                if (!leavedata) {
                    return await interaction.reply({
                        content: `**[❌]** **Vous ne possédez pas** de salon de bienvenue !\n 🔎 Faites la commande **/welcome create** pour le créer.`,
                        ephemeral: true
                    });
                } else {
                    await welcomeMessageSchema.deleteMany({
                        Guild: interaction.guild.id
                    });

                    const customEmbedColor = await customEmbedColorSchema.findOne({ Guild: interaction.guild.id });

                    const embed = new EmbedBuilder()
                        .setColor(`#${customEmbedColor ? customEmbedColor.Color : "000000"}`)
                        .setTitle(`🎉 Votre salon de bienvenue a été supprimer avec succès !`)
                        .setAuthor({
                            name: `ASGARD - SALON DE BIENVENUE`,
                            iconURL: 'https://i.ibb.co/mHdzBj5/GCd0-XNB-Imgur.png',
                            url: 'https://discord.com'
                        })
                        .setFooter({
                            text: 'Asgard © 2023 | Pour toute information, faites la commande /botinfo'
                        })
                        .setFields({ name: `• Salon supprimer avec succès`, value: `> 🔎 Pour refaire un salon de bienvenue, faites la commande **/welcome-message set**`, inline: false });

                    await interaction.reply({ embeds: [embed] });
                }
                break;
        }
    }
};
