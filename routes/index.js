var express = require("express");
var router = express.Router();
var cheerio = require("cheerio");
var request = require("request");
var datetime = require("node-datetime");

/* GET home page. */
router.get("/", function(req, res) {
  let date=new Date();
  var day=date.getDate();
  var month=date.getMonth();
  var year=date.getFullYear();

  var dateFrom=datetime.create(createDate(day,month+1,year)).getTime()/1000;
  var dateTo=datetime.create(createDate(day,month+2,year)).getTime()/1000;

  getDataProducts(20, dateFrom, dateTo, data => {
    let reponse = [];
    let sortData = sortProduct(data.data, false);
    sortData.forEach(element => {
      if (element.discount_percent) {
        reponse.push(element);
      }
    });

    res.render("index", { data: reponse ,error:''});
  });
});
function sortProduct(listProducts, desc) {
  return listProducts.sort((a, b) => {
    if (!desc) {
      return parseFloat(b.discount_percent) - parseFloat(a.discount_percent);
    } else {
      return parseFloat(a.discount_percent) - parseFloat(b.discount_percent);
    }
  });
}
function getDataProducts(perPage, from, to, callback) {
  var link =
    "https://tiki.vn/api/v2/deals/collections/?type=now&page=1&per_page=" +
    perPage +
    "&from=" +
    from +
    "&to=" +
    to;
  console.log(link);
  request(link, function(err, result, body) {
    let data = JSON.parse(body);
    callback(data);
  });
}
router.post("/getList", (req, res) => {
  let perPage = req.body.count;
  console.log("From1" + req.body.from);
  console.log("To1" + req.body.to);
 
  var from = datetime.create(req.body.from.toString()).getTime() / 1000;
  var to = datetime.create(req.body.to.toString()).getTime() / 1000;

let error;
  getDataProducts(perPage, from, to, data => {
    let reponse = [];
    let sortData = sortProduct(data.data, false);
    sortData.forEach(element => {
      if (element.discount_percent) {
        reponse.push(element);
      }
    });
if(data.data.length==0) {error= 'Nhập sai ngày (Ngày kết thúc phải lớn hơn ngày bắt đầu và lớn hơn ngày hiện tại'};
 
   res.render("index", { data: reponse,error:error });
//   res.end('ok');
  });
});
 
function createDate(m,d,y){
return d+'/'+m+'/'+y;
}
router.get("/time", function(req, res) {
  

  var d = new Date();
  console.log(d.getDay() + "/" + d.getMonth() + 1 + "/" + d.getFullYear());
  var dt2 = datetime.create(d);
  console.log("dd" + dt2.getTime());
});
router.get("/getList", function(req, res) {
  
res.redirect('/');
});
module.exports = router;
