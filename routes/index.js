var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var request = require('request');
var datetime = require('node-datetime');

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index',{data:''});
});
function sortProduct(listProducts, desc) {
  return listProducts.sort((a, b) => {
    if (!desc) {
      return parseFloat(b.discount_percent) - parseFloat(a.discount_percent)
    }
    else {
      return parseFloat(a.discount_percent) - parseFloat(b.discount_percent)
    }
  });

}
function getDataProducts(perPage,from,to,callback) {
  var link = 'https://tiki.vn/api/v2/deals/collections/?type=now&page=1&per_page='+perPage+'&from='+from+'&to='+to;
  console.log(link);
  request(link, function (err, result, body) {
    let data = JSON.parse(body);
    callback(data);
  });
}
router.post('/getList', (req, res) => {
  let perPage=20;
  // let from=1548614905
  // let to=1553798905;
  console.log('req'+req.body.from)
  var from = datetime.create(req.body.from.toString()).getTime()/1000;
  var to=datetime.create(req.body.to.toString()).getTime()/1000;
 console.log('from'+from);
  
  console.log('From' +req.body.from)
  console.log('To' +req.body.to)
  getDataProducts(perPage,from,to,(data) => {
    let reponse = [];
    let sortData = sortProduct(data.data, false)
    sortData.forEach(element => {
      if (element.discount_percent) {
        reponse.push(element);
      }
    });
 
    res.render('index',{data:reponse})
  
   
  })




})
router.post('/getList',(req,res)=>{

});


router.get('/time', function (req, res) {
  var dt = datetime.create('02/06/2019');
  var dt2=datetime.create('02/10/2019')
 
  
console.log(dt.getTime()/1000);
console.log(dt2.getTime()/1000);
});
module.exports = router;
