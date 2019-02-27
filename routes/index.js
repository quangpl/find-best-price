var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var request = require('request');
var datetime = require('node-datetime');

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index');
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
router.get('/getDeal', (req, res) => {
  getDataProducts(100,1548614905,1553798905,(data) => {
    let reponse = [];
    let sortData = sortProduct(data.data, false)
    sortData.forEach(element => {
      if (element.discount_percent) {
        reponse.push(element);
      }
    });
    res.json(reponse);
  })




})


router.get('/time', function (req, res) {
  var dt = datetime.create('2015-04-30');
  var date = new Date();
  var formattedDate = dt.format('d/m/y');
  console.log(dt.getTime() < date.getTime())

});
module.exports = router;
