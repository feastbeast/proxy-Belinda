function generateRandomId(userContext, events, done) {
  const randomNum = Math.random();
  if (randomNum < 0.68) {
    userContext.vars.randomId = Math.floor(randomNum * 10);
  } else {
    userContext.vars.randomId = Math.floor(randomNum * 10000000);
  }
  return done();
}

module.exports = {
  generateRandomId,
};
