const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5500
const base = require('airtable').base(process.env.AIRTABLE_BASE);

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/times', (req, res) => res.send(showTimes()))
  .get('/test-airtable/:tableName', function (request, response) {
    const { tableName } = request.params;
    base(tableName).select().firstPage().then(([firstEntry]) => {
      response.json({
        message: `${firstEntry._table.name} ${JSON.stringify(firstEntry.fields)}`
      });
    }).catch(err => {
      err.mensaje='Victor'
      response.status(500).json(err)
    });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

showTimes = () => {
  let result = '';
  const times = process.env.TIMES || 5;
  for (i = 0; i < times; i++) {
    result += i + ' ';
  }
  return result;
}
