const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5500
const base = require('airtable').base(process.env.AIRTABLE_BASE_ID);

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/times', (req, res) => res.send(showTimes()))
  .get('/test-airtable/:tableName', (req,res)=>testAirtable(req,res))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

showTimes = () => {
  let result = '';
  const times = process.env.TIMES || 5;
  for (i = 0; i < times; i++) {
    result += i + ' ';
  }
  return result;
}


testAirtable = (req,res) => {
 /* var Airtable = require('airtable');
  var base = new Airtable({apiKey: 'keyAkPfL8VQQkA9jG'}).base('appnRqx6wupbDHFzY');

  base(tableName).select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 3,
      view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
  
      records.forEach(function(record) {
          console.log('Retrieved', record.get('id'));
      });
  
      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();
  
  }, function done(err) {
      if (err) { console.error(err); return; }
  });
*/
  const { tableName } = req.params;

  base(tableName).select().firstPage().then(([firstEntry]) => {
    return res.json({
      message: `${firstEntry._table.name} ${JSON.stringify(firstEntry.fields)}`
    });
  }).catch(err => {
    err.mensaje=tableName
    return res.status(500).json(err)
  });
}
