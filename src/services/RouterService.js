const rules = {
  '📢 Add event.🔍 Once' : addEventOnce
};

export function routerMiddleware(path, session) {
  // if(session.previousPath !== undefined){
  //   let action = rules[session.previousPath+'.'+path]
  //   if(action !== undefined){
  //       action(session);
  //   }
  // }
  // session.previousPath = path
}

function addEventOnce(session) {
  session.newEvent = {};
}
