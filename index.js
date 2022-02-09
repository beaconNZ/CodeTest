"use strict";
exports.__esModule = true;
var fs = require("fs");
var csv_parse_1 = require("csv-parse");
var findTrafficSolutionFromCSV = function (fileLocaiton) {
    var csvData = [];
    fs.createReadStream(fileLocaiton)
        .pipe((0, csv_parse_1.parse)({ delimiter: ":" }))
        .on("data", function (csvrow) {
        csvData.push(csvrow[0].split(","));
    })
        .on("end", function () {
        csvData.forEach(function (roadEntry) {
            var roads = roadEntry.map(function (numString) {
                return parseInt(numString, 10);
            });
            findTrafficSolution(roads);
        });
    });
};
var findTrafficSolutionWithArgs = function () {
    var myArgs = process.argv.slice(2);
    var roads = myArgs.map(function (numString) {
        return parseInt(numString, 10);
    });
    findTrafficSolution(roads);
};
var IntersectionCosts;
(function (IntersectionCosts) {
    IntersectionCosts[IntersectionCosts["STOP_SIGN"] = 40000] = "STOP_SIGN";
    IntersectionCosts[IntersectionCosts["ROUND_ABOUT"] = 100000] = "ROUND_ABOUT";
    IntersectionCosts[IntersectionCosts["TRAFFIC_LIGHTS"] = 200000] = "TRAFFIC_LIGHTS";
})(IntersectionCosts || (IntersectionCosts = {}));
function findTrafficSolution(roads) {
    var roundaboutMap = new Map([
        ["low", 0.9],
        ["medium", 0.75],
        ["high", 0.5],
    ]);
    var trafficLightMap = new Map([
        ["low", 0.3],
        ["medium", 0.75],
        ["high", 0.9],
    ]);
    var stopSignMap = new Map([
        ["low", 0.4],
        ["medium", 0.3],
        ["high", 0.2],
    ]);
    var roundaboutEfficiancy = 1;
    var trafficLightefficiancy = 1;
    var stopSignEfficiancy = 1;
    //check for missing inputs
    if (roads.length < 4) {
        console.log("not enough roads entered as params");
        return;
    }
    //Function is designed to find out whats efficiant for the most number of cars
    var testEfficiancy = function (map) {
        var calcEfficiancy = 1;
        roads.forEach(function (road) {
            var _a, _b, _c;
            if (road < 10) {
                calcEfficiancy += road * ((_a = map.get("low")) !== null && _a !== void 0 ? _a : 0);
            }
            else if (road >= 10 && road < 20) {
                calcEfficiancy += road * ((_b = map.get("medium")) !== null && _b !== void 0 ? _b : 0);
            }
            else {
                calcEfficiancy += road * ((_c = map.get("high")) !== null && _c !== void 0 ? _c : 0);
            }
        });
        return calcEfficiancy;
    };
    roundaboutEfficiancy = testEfficiancy(roundaboutMap);
    //test for high CPM relativity for roundAbout bonus
    var roadX = roads[0] + roads[2];
    var roadY = roads[1] + roads[3];
    if (roadX / roadY >= 2 || roadX / roadY < 0.5) {
        //If one road is 2x the other call that high relativity
        roundaboutEfficiancy *= 1.1;
    }
    stopSignEfficiancy = testEfficiancy(stopSignMap);
    trafficLightefficiancy = testEfficiancy(trafficLightMap);
    console.log("road values: ", roads[0], roads[1], roads[2], roads[3]);
    if (roundaboutEfficiancy >= stopSignEfficiancy &&
        roundaboutEfficiancy >= trafficLightefficiancy) {
        console.log("A roundabout is the most efficiant solution");
    }
    else if (stopSignEfficiancy >= trafficLightefficiancy) {
        console.log("A stop sign is the most efficiant solution");
    }
    else {
        console.log("A traffic light system is the most efficiant solution");
    }
    var totalRoadCPM = roads.reduce(function (i, j) { return i + j; });
    console.log("roundabout eff:", roundaboutEfficiancy, "RoundAbout CPM/$: ", IntersectionCosts.ROUND_ABOUT / totalRoadCPM);
    console.log("traffic light eff:", trafficLightefficiancy, "Traffic Light CPM/$:", IntersectionCosts.TRAFFIC_LIGHTS / totalRoadCPM);
    console.log("stop sign eff:", stopSignEfficiancy, "Stop Sign CPM/$:", IntersectionCosts.STOP_SIGN / totalRoadCPM);
    return;
}
//  UNCOMMENT TO TEST
findTrafficSolutionWithArgs();
// findTrafficSolutionFromCSV("./data.csv");
