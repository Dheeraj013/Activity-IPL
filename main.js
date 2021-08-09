let request = require("request");
let cheerio = require("cheerio");
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
let scorecardObj = require("./scorecard");
const { fstat } = require("fs");
let fs = require("fs");
let path = require("path");
let iplpath = path.join(__dirname, "ipl");
dircre(iplpath);


request(url, cb);
function cb(error, response, html){
    //console.error('erroe:', error); // print out the error if found
    //

    if(error){
        console.log(error); //print the error if one required
    }
    else if(response.statuscode == 404){
        console.log("Page Not Found");
    }
    else{
        // console.log(html)  //print the html for the request made
        // console.log("html", );
        dataExtracter(html);
    }
}

function dataExtracter(html){
    //searchtool
    let searchtool = cheerio.load(html);
    // css selector -> elem
    let allresult = searchtool(`.widget-items>a`);
    let link = allresult.attr("href");

    let fullallresultlink = `https://www.espncricinfo.com${link}`;
    // console.log(html);

    request(fullallresultlink, newcb)

}
function newcb(error, response, html){
    if(error){
        console.log(error); //print the error if one required
    }
    else if(response.statuscode == 404){
        console.log("Page Not Found");
    }
    else{
        // console.log(html)  //print the html for the request made
        // console.log("html", );
        getallscorecardlink(html);
    }
}
function getallscorecardlink(html){
    let searchtool = cheerio.load(html);
    let allscorecard = searchtool("a[data-hover='Scorecard']");
    for(let i = 0; i < allscorecard.length; i++){
        let allfulllink = searchtool(allscorecard[i]).attr("href");
        let fulllink = `https://www.espncricinfo.com${allfulllink}`;
        console.log(fulllink);
        scorecardObj.processSinglematch(fulllink);
        
    }
    console.log("````````````````````````````````````````````");
    
}

function dircre(filepath){
    if(fs. existsSync(filepath) == false){
        fs.mkdirSync(filepath);
    }
}
