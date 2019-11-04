const app = require('./app');

app.set('port', process.env.PORT || 3001);

app.listen(app.get('port'), () => {
  console.log(`Trapper Keeper is running ⚡️ on http://localhost:${app.get('port')}.`)
});