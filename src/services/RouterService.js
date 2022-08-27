import { Markup } from 'telegraf';
import { formatDistance, subDays, subYears, subMonths, addYears, addDays, addMonths, format } from 'date-fns'

const rules = {
  '📢 Add event.🔍 Once' : addEventOnce
};

export function routerMiddleware(pathkey, ctx) {
  if(rules[pathkey] !== undefined){
    let action = rules[pathkey]
    if(action !== undefined){
      console.log(formatDistance(subDays(new Date(), 3), new Date(), { addSuffix: true }))
        action(ctx);
    }
  }
}

function addEventOnce(ctx) {
  ctx.session.newEvent = {};
  ctx.reply('Choose Year', Markup
    .keyboard(dateFormat('month1'),  {
      wrap: (btn, index, currentRow) => currentRow.length >= (index + 10) / 3
    })
    .oneTime()
    .resize()
  )
}

function dateFormat(period) {
  let now = new Date();
  let response = [];
  switch (period) {
    case 'year':
      response.push(format(subYears(now,1), 'y'))
      response.push(format(now, 'y'))
      response.push(format(addYears(now,1), 'y'))
      break;
    case 'month':
      response.push(format(subMonths(now,1), 'MMMM'))
      response.push(format(now, 'MMMM'))
      response.push(format(addMonths(now,1), 'MMMM'))
      break;
    default:
      for (let i = 10; i > 0; i--) {
        response.push(format(subDays(now,i), 'dd.LL'))
      }
      for (let i = 0; i < 10; i++) {
        response.push(format(addDays(now,i), 'dd.LL'))
      }
  }

  return response
}
