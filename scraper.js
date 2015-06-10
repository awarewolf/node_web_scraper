var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var url = 'http://substack.net/images/';
var csvFile = 'substack_images.csv';
fs.open(csvFile, 'a+', function(err) {
    if (err) throw err;
    console.log(csvFile + " created");
});

function getHtmlBody(url, callback) {
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(body);
    }
  });
}

getHtmlBody(url, function(result) {
  $ = cheerio.load(result);
  var fileTypeRegex=/\w/;

  $('tr').each(function(i, elem) {

    fileName = $(elem).find('a').text();
    fileType = fileName.substring(fileName.lastIndexOf('.')+1);

    if (fileName.lastIndexOf('.') !== -1 && fileTypeRegex.test(fileType)) {

      filePermission = $(elem).children().first().text();
      absoluteUrl = url + fileName;
      fileType = fileName.substring(fileName.lastIndexOf('.')+1);

      row = filePermission + ", " + absoluteUrl + ", " + fileType + "\n";

      fs.appendFile(csvFile, row, function(err) { });
    }
  });
});
