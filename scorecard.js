let request = require("request");
let cheerio = require("cheerio");

const { Console } = require("console");
const { isNullOrUndefined } = require("util");
// let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/kolkata-knight-riders-vs-kings-xi-punjab-46th-match-1216520/full-scorecard"
let fs = require("fs");
let path = require("path");

function processSinglematch(url){
    request(url, cb);
}
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
    let searchtool = cheerio.load(html);
    
    
    let desc = searchtool(".event .description");
    let result = searchtool(".event .status-text");
    let venue = desc.text().split(",")[1].trim();
    let date = desc.text().split(",")[2].trim();
    let result1 = result.text();

    let ininingarr = searchtool(".Collapsible");
    // let scorecard = "";
    for(let i = 0; i < ininingarr.length; i++){
        // scorecard = searchtool(ininingarr[i]).html();
        // fs.writeFileSync(`inningss${i}.html`, scorecard);
        let teamNameElem = searchtool(ininingarr[i]).find("h5");
        let teamname = teamNameElem.text();
        teamname = teamname.split("INNINGS")[0];
        teamname = teamname.trim();
        let oppidx = i==0?1:0;
        let oppteamname = searchtool(ininingarr[oppidx]).find("h5").text();
        oppteamname = oppteamname.split("INNINGS")[0].trim();
        console.log(venue+ "  "+ date+ "  "+ teamname+ "  "+ oppteamname+ "  "+ result1);
        
        let batsmantableallrows = searchtool(ininingarr[i]).find(".table.batsman tbody tr");
        // console.log(batsmantableallrows);
        for(let j = 0; j < batsmantableallrows.length; j++){
            let nooftds = searchtool(batsmantableallrows[j]).find("td");
            if(nooftds.length == 8){
                let playername = searchtool(nooftds[0]).text();
                let runs = searchtool(nooftds[2]).text().trim();
                let balls = searchtool(nooftds[3]).text().trim();
                let fours = searchtool(nooftds[5]).text().trim();
                let sixes = searchtool(nooftds[6]).text().trim();
                let sr = searchtool(nooftds[7]).text().trim();


                // console.log(playername+ "  "+ runs+ "  "+ balls+ "  "+ fours+ "  "+ sixes+ "  "+ sr);

                finalprocessingPlayer(teamname,playername, runs, balls, fours, sixes, sr, oppteamname, venue, date, result1);

            }
        }
    } 
}

function finalprocessingPlayer(teamname,playername, runs, balls, fours, sixes, sr, oppteamname, venue, date, result1){
    let teamPath = path.join(__dirname, "ipl", teamname)
    let inputdata = {
        teamname,
        playername, 
        runs, 
        balls, 
        fours, 
        sixes, 
        sr, 
        oppteamname, 
        venue, 
        date, 
        result1
        
    }
    dircre(teamPath);
    let Playerpath = path.join(teamPath, playername + ".json");
    let jsonWriteable = JSON.stringify(inputdata);
    fs.writeFileSync(Playerpath, jsonWriteable);
}

function dircre(filepath){
    if(fs. existsSync(filepath) == false){
        fs.mkdirSync(filepath);
    }
}

module.exports = {
    processSinglematch
 }