// Discord bot implements
const { setTimeout } = require('node:timers/promises');
const discordTranscripts = require('discord-html-transcripts');
const { Client, GatewayIntentBits, ButtonBuilder, ActionRowBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });
const prefix = 'pj!';
const token = process.env.TOKEN;

// botが準備できれば発動され、 上から順に処理される。
client.on("ready", () => {
  // コンソールにReady!!と表示
  console.log("Ready!!");

  // ステータスを設定する
  setInterval(() => {
    client.user.setActivity({
      name: `所属サーバー数は、${client.guilds.cache.size}サーバー｜　Ping値は、${client.ws.ping}msです`
    })
  }, 10000)
  client.channels.cache.get("889486664760721418").send("起動しました！");

  // readyイベントここまで
});

client.on('guildCreate', guild => {
  let first_ch= guild.channels.cache.at(1)
  first_ch.send({
    embeds: [
      {
        title: "⚠注意事項とご案内⚠",
        description: "本BOTを導入いただき、ありがとうございます。\n\n本BOTのサポートパネル作成機能は、以下の点をご確認いただいたうえでご利用ください。\n　・サポートチャンネルのチャンネルトピック([数字の羅列]かclosed:[数字羅列])は、絶対に編集しないでください。\n　・サポートチャンネルを削除した後にこちらからサポートの履歴を復旧させることはできません。\n　・お客様１人あたり１チャンネルのみ作成できます。複数のチャンネルが必要な場合は、スレッドを立てる等の対応をお願いします。",
        color: 0xFF0000,
        timestamp: new Date(),
        thumbnail: {
          url: 'attachment://logo.png'
        },
        footer: {
          text: 'This bot is made by Hoshimikan6490',
          icon_url: 'attachment://me.png',
        },
      }
    ],
    files: [
      {
        attachment: "images/logo.png",
        name: "logo.png"
      }, {
        attachment: "images/me.png",
        name: "me.png"
      }
    ]
  })
});

// botがメッセージを受信すると発動され、 上から順に処理される。
client.on('messageCreate',async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command === 'help') {
    message.channel.send({
      embeds: [
        {
          title: "Planet bot β (JS)について",
          description: "node.jsで作成された、BOT開発テスト用のbotです。",
          color: 3823616,
          timestamp: new Date(),
          thumbnail: {
            url: 'attachment://logo.png'
          },
          footer: {
            text: 'This bot is made by Hoshimikan6490',
            icon_url: 'attachment://me.png',
          },
        }
      ],
      files: [
        {
          attachment: "images/logo.png",
          name: "logo.png"
        }, {
          attachment: "images/me.png",
          name: "me.png"
        }
      ]
    });
  } else if (command === 'support_panel') {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.channel.send('あなたは、このサーバーの管理者権限を持っていません。\nこのコマンドの実行には管理者権限が必須です。');
    //権限確認
    message.delete();
    const help_start = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('support')
          .setLabel('お問い合わせを始める')
          .setStyle(ButtonStyle.Primary)
          .setEmoji("🎫"),
      );  
    //button作る
    await message.channel.send({
      embeds: [
        {
          title: "🎫お問い合わせ🎫",
          description: "質問・要望・バグ報告がある場合は下のボタンを押してください。\nサポートチームが対応いたします。",
          color: 0x00eaff,
          footer: {
            text: '↓ここをクリックして始めてください↓'
          }
        }
      ],
      components: [help_start]
    });
    //embedとbutton送信
    if (message.guild.channels.cache.find(name => name.name === "support")) return;
    //supportというカテゴリーがあったらreturn
    message.guild.channels.create('support', {
      type: 'GUILD_CATEGORY'
    });
    //supportというカテゴリーを作る
  }
});


client.on('interactionCreate', async (interaction) => {
  if (interaction.customId === "support") {
    await interaction.deferReply({
      ephemeral: true
    });
    //supportというIDのボタンが押されたら実行
    const supportid = interaction.user.id
    //supportIDはボタンを押したユーザーIDと同じと定義する
    if (interaction.guild.channels.cache.find(channel => channel.topic === supportid && channel.type === ChannelType.GuildText)) {
      let already_channel_id = interaction.guild.channels.cache.find(channel => channel.topic === supportid).id
      await interaction.editReply({
        content: `１人１チャンネルとさせていただいております。\n<#${already_channel_id}>が既に存在しますので、そちらをご利用ください。`,
        //メッセージ
        ephemeral: true
        //その人にしか見れないようにする
      });
    }
    //ギルドにユーザーIDのチャンネルがあったら処理をやめる
    const ct = interaction.guild.channels.cache.find(name => name.name === "support")
    //supportというカテゴリーを探す
    if (!ct) return interaction.channel.send("__**supportカテゴリーが見つかりません❕**__\nサーバーの管理者はもう一度`p!support_panel`コマンドを実行してください。");
    //見つからなかったら処理しない
    const user_name = interaction.user.username;
    interaction.guild.channels.create({
      name: user_name + "様対応",
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: 
            [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.ReadMessageHistory, 
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.AttachFiles, 
              PermissionFlagsBits.AddReactions
            ]
        }
      ],
      parent: ct.id,
      topic: supportid
    }).then(async (channels) => {
      //成功した場合
      const menue = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('menue')
            .setLabel('メニューを開く')
            .setStyle(ButtonStyle.Primary)
            .setEmoji("📚"),
        );
      //buttonを作成
      let top_message = await channels.send({
        content: "<@" + interaction.user.id + ">様へ",
        embeds: [{
          title: "📪お問い合わせありがとうございます。",
          description: "ご用件をお書きください。",
          footer: {
            text: '業務連絡 ｜ 管理者は、以下のボタンでこのチャンネルを管理できます。',
          },
          color: 0x1f6e00
        }],
        components: [menue]
        //buttonを送信
      });
      top_message.pin();
      await interaction.editReply({
        content: `${channels}にてお聞きいたします。そちらのチャンネルへどうぞ！`,
        //メッセージ
        ephemeral: true
        //押した人にしか見れないようにする
      });
    }).catch(e => interaction.reply(`エラー:${e.message}`))
  }

  if (interaction.customId === "menue") {
    if (interaction.member.permissions.has("ADMINISTRATOR")) {
      const options = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('transcript')
            .setLabel('保存する')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("📥"),
          new ButtonBuilder()
            .setCustomId('lock')
            .setLabel('ロックをする')
            .setStyle(ButtonStyle.Success)
            .setEmoji("🔒"),
          new ButtonBuilder()
            .setCustomId('reopen')
            .setLabel('ロックを解除する')
            .setStyle(ButtonStyle.Success)
            .setEmoji("🔓"),
          new ButtonBuilder()
            .setCustomId('delete')
            .setLabel('削除する')
            .setStyle(ButtonStyle.Danger)
            .setEmoji("⛔"),
          new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('メニュを閉じる')
            .setStyle(ButtonStyle.Secondary),
        );
      let topic = interaction.channel.topic;
      let ui = topic.replace(/[^0-9]/g, '')
　　    await interaction.reply({
        embeds: [{
          title: '📚｜メニュー',
          description: `「📥保存する」で、このチャンネルのチャット履歴をheml形式で保存できます。\n　※__**直近の100メッセージに限られます**__。\n「🔒ロックをする」で、<@${ui}> の閲覧権限を**剥奪**します\n「🔓ロック解除」で、<@${ui}> の閲覧権限を**再度付与**します。\n「⛔削除」で、このチャンネルを完全に削除します。`,
          color: 0x40ffcc
        }],
        components: [options]
      })
    } else {
      //管理者権限無いとき
      await interaction.reply({
        content: "このボタンは管理者のみ有効です",
        ephemeral: true
      })
    }
  }
  
  if (interaction.customId === "transcript" ) {
    if (interaction.member.permissions.has("ADMINISTRATOR")) {
      interaction.message.delete()
      
      const channel = interaction.channel; // or however you get your TextChannel
      const channel_topic = channel.topic
      const customer_user_id = channel_topic.substr( 6 )
      
      // Must be awaited
      const attachment = await discordTranscripts.createTranscript(channel, {
        limit: -1,
        filename: `support_transcript_with_${customer_user_id}.html`
      });

      const cancel = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('閉じる')
            .setStyle(ButtonStyle.Secondary),
        );
          
      await interaction.reply({
        embeds: [
          {
            title: "📤｜出力しました",
            description: "__**必ず、ご自身のデバイスにダウンロードしてください！**__",
            color: 0x20FF20
          }
        ],
        files: [attachment],
        components: [cancel]
      })
    }
  }

  if (interaction.customId === "lock") {
    if (interaction.member.permissions.has("ADMINISTRATOR")) {      
      let ui = interaction.channel.topic;
      if (!ui.startsWith("closed:")) {
        interaction.channel.setTopic("closed:" + ui)
        interaction.channel.permissionOverwrites.set([
          {
            id: ui,
            deny: [PermissionFlagsBits.ViewChannel], // 許可しない権限
            type: "member" // role or member
          }
        ], 'closeしたため');

        interaction.message.delete()
      
        interaction.reply({
          embeds: [
            {
              title: "🔒｜closeしました！",
              color: 0x00FF00
            }
          ]
        })
      } else {
        await interaction.reply({
          content: "すでにCloseされています",
          ephemeral: true
        })
      }
    } else {
      //管理者権限無いとき
      await interaction.reply({
        content: "このボタンは管理者のみ有効です",
        ephemeral: true
      })
    }
  }

  if (interaction.customId === "reopen") {
    if (interaction.member.permissions.has("ADMINISTRATOR")) {
    let ui = interaction.channel.topic;
    let ui_number = ui.replace(/[^0-9]/g, '')
    interaction.channel.setTopic(ui_number)
    interaction.channel.permissionOverwrites.set([
      {
        id: ui_number,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.ReadMessageHistory, 
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.AttachFiles, 
          PermissionFlagsBits.AddReactions
        ],// 許可する権限
        type: "member" // role or member
       }
    ], 'reopenしたため');
    interaction.message.delete()
    await interaction.channel.send({
      embeds: [
        {
          title: "🔓｜reopenしました！",
          color: 0x20FF20
        }
      ]
    })
    }
  }

  if (interaction.customId === "delete") {
    interaction.message.delete()
    const denger_options = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('cancel')
          .setLabel('やめる')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("delete_true")
          .setLabel("完全に削除する")
          .setStyle(ButtonStyle.Danger),
      );
    await interaction.channel.send({
      embeds: [{
        title: "本当に削除してもいいですか？",
        description: "この操作を実行すると、__**このチャンネルのログは永久に閲覧できなくなります**__。",
        color: 0xFF0000
      }],
      components: [denger_options]
    });
  }

  if (interaction.customId === "cancel") {
    interaction.message.delete()
  }

  if (interaction.customId === "delete_true") {
    await interaction.reply("まもなく削除されます…")
    let del_ch_id = interaction.channel.id;
    let del_ch = interaction.guild.channels.cache.get(del_ch_id);
    await setTimeout(1000);
    del_ch.delete()
      .catch(e => interaction.reply(`エラー:${e.message}`))
  }
});


// botログイン
client.login(token);
