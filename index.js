import {Telegraf, session, Markup } from 'telegraf';
import {sum} from './src/router.js';
import {sessionMiddleware} from './src/services/SessionService.js';
import {routerMiddleware} from './src/services/RouterService.js';
import LocalSession from 'telegraf-session-local';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const token = process.env.TG_TOKEN;
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!')
}

const bot = new Telegraf(token)

bot.use((new LocalSession({ database: 'example_db.json' })).middleware())

//Middleware
bot.use(async (ctx, next) => {
  let response = sessionMiddleware(ctx.update.message.text, ctx.session);
  console.log(response);
  routerMiddleware(ctx.update.message.text, ctx.session);

  await next() // runs next middleware
})




bot.command('onetime', (ctx) =>
  ctx.reply('One time keyboard', Markup
    .keyboard(['/simple', '/inline', '/pyramid'])
    .oneTime()
    .resize()
  )
)

bot.command('start', async (ctx) => {
ctx.session.counter = ctx.session.counter || 0
  ctx.session.counter++
  ctx.replyWithMarkdown(`Counter updated, new value: \`${ctx.session.counter}\`` + sum(2, 5))

  ctx.session.messageCount = 1

  ctx.reply('Custom buttons keyboard', Markup
    .keyboard([
      ['🔍 Calendar', '😎 Notices'], // Row1 with 2 buttons
      ['☸ Lists', '📞 Saves'], // Row2 with 2 buttons
      ['📢 Add event', '⭐️ Add note', '👥 Add list'] // Row3 with 3 buttons
    ])
    .oneTime()
    .resize()
  )
})

bot.hears('🔍 Search', ctx => ctx.reply('Yay!'))
bot.hears('📢 Add event', ctx => {
  ctx.reply('Event period', Markup
    .keyboard([
      ['🔍 Once', '😎 Every Day', 'Every Week'], // Row1 with 2 buttons
      ['Every Month','☸ Every Year', '📞 Custom'], // Row2 with 2 buttons
    ])
    .oneTime()
    .resize()
  )
})

bot.command('special', (ctx) => {
  return ctx.reply(
    'Special buttons keyboard',
    Markup.keyboard([
      Markup.button.contactRequest('Send contact'),
      Markup.button.locationRequest('Send location')
    ]).resize()
  )
})

bot.command('pyramid', (ctx) => {
  return ctx.reply(
    'Keyboard wrap',
    Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
      wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2
    })
  )
})

bot.command('simple', (ctx) => {
MyFn.fn1();
  return ctx.replyWithHTML(
    '<b>Coke</b> or <i>Pepsi?</i>',
    Markup.keyboard(['Coke', 'Pepsi'])
  )
})

bot.command('inline', (ctx) => {
  return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      Markup.button.callback('Coke', 'Coke'),
      Markup.button.callback('Pepsi', 'Pepsi')
    ])
  })
})

bot.command('random', (ctx) => {
  return ctx.reply(
    'random example',
    Markup.inlineKeyboard([
      Markup.button.callback('Coke', 'Coke'),
      Markup.button.callback('Dr Pepper', 'Dr Pepper', Math.random() > 0.5),
      Markup.button.callback('Pepsi', 'Pepsi')
    ])
  )
})

bot.command('caption', (ctx) => {
  return ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' },
    {
      caption: 'Caption',
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        Markup.button.callback('Plain', 'plain'),
        Markup.button.callback('Italic', 'italic')
      ])
    }
  )
})

bot.hears(/\/wrap (\d+)/, (ctx) => {
  return ctx.reply(
    'Keyboard wrap',
    Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
      columns: parseInt(ctx.match[1])
    })
  )
})

bot.action('Dr Pepper', (ctx, next) => {
  return ctx.reply('👍').then(() => next())
})

bot.action('plain', async (ctx) => {
  await ctx.answerCbQuery()
  await ctx.editMessageCaption('Caption', Markup.inlineKeyboard([
    Markup.button.callback('Plain', 'plain'),
    Markup.button.callback('Italic', 'italic')
  ]))
})

bot.action('italic', async (ctx) => {
  await ctx.answerCbQuery()
  await ctx.editMessageCaption('_Caption_', {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      Markup.button.callback('Plain', 'plain'),
      Markup.button.callback('* Italic *', 'italic')
    ])
  })
})

bot.action(/.+/, (ctx) => {
  return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`)
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
