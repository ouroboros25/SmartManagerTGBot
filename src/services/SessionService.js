const rules = {
  '📢 Add event.🔍 Once' : addEventOnce
};

export function sessionMiddleware(path, session) {
  let pathKey = undefined
  if(session.previousPath !== undefined){
    pathKey = session.previousPath+'.'+path
    let action = rules[pathKey]
    if(action !== undefined){
        action(session);
    }
  }
  session.previousPath = path

  return pathKey ?? path;
}

function addEventOnce(session) {
  session.newEvent = {};
}
