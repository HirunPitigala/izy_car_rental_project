const mysql = require('mysql2/promise');
(async () => {
  const c = await mysql.createConnection({host:'localhost',user:'root',password:'Hirun2020.',database:'car_rental_system',port:3306});
  const [cols] = await c.query('DESCRIBE booking');
  const colNames = cols.map(x => x.Field);
  for (const col of colNames) { console.log('COL:', col); }
  console.log('---');
  const [cats] = await c.query('SELECT * FROM service_category');
  for (const cat of cats) { console.log('CAT:', cat.category_id, cat.category_name); }
  await c.end();
})().catch(e => console.error(e.message));
