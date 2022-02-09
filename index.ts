import * as fs from "fs";
import { parse } from "csv-parse";

const findTrafficSolutionFromCSV = (fileLocaiton: string) => {
  var csvData: Array<Array<string>> = [];
  fs.createReadStream(fileLocaiton)
    .pipe(parse({ delimiter: ":" }))
    .on("data", function (csvrow: Array<String>) {
      csvData.push(csvrow[0].split(","));
    })
    .on("end", function () {
      csvData.forEach((roadEntry) => {
        const roads: Array<number> = roadEntry.map((numString) => {
          return parseInt(numString, 10);
        });
        findTrafficSolution(roads);
      });
    });
};

const findTrafficSolutionWithArgs = () => {
  const myArgs = process.argv.slice(2);
  const roads: Array<number> = myArgs.map((numString) => {
    return parseInt(numString, 10);
  });
  findTrafficSolution(roads);
};

enum IntersectionCosts {
    STOP_SIGN = 40000,
    ROUND_ABOUT = 100000,
    TRAFFIC_LIGHTS = 200000,
  }


function findTrafficSolution(roads: Array<number>) {
  const roundaboutMap = new Map<string, number>([
    ["low", 0.9],
    ["medium", 0.75],
    ["high", 0.5],
  ]);
  const trafficLightMap = new Map<string, number>([
    ["low", 0.3],
    ["medium", 0.75],
    ["high", 0.9],
  ]);
  const stopSignMap = new Map<string, number>([
    ["low", 0.4],
    ["medium", 0.3],
    ["high", 0.2],
  ]);

  let roundaboutEfficiancy = 1;
  let trafficLightefficiancy = 1;
  let stopSignEfficiancy = 1;

  //check for missing inputs
  if (roads.length < 4) {
    console.log("not enough roads entered as params");
    return;
  }

  //Function is designed to find out whats efficiant for the most number of cars
  const testEfficiancy = (map: Map<string, number>) => {
    let calcEfficiancy = 1;
    roads.forEach((road: number) => {
      if (road < 10) {
        calcEfficiancy += road * (map.get("low") ?? 0);
      } else if (road >= 10 && road < 20) {
        calcEfficiancy += road * (map.get("medium") ?? 0);
      } else {
        calcEfficiancy += road * (map.get("high") ?? 0);
      }
    });
    return calcEfficiancy;
  };

  roundaboutEfficiancy = testEfficiancy(roundaboutMap);
  //test for high CPM relativity for roundAbout bonus
  let roadX: number = roads[0] + roads[2];
  let roadY: number = roads[1] + roads[3];

  if (roadX / roadY >= 2 || roadX / roadY < 0.5) {
    //If one road is 2x the other call that high relativity
    roundaboutEfficiancy *= 1.1;
  }
  stopSignEfficiancy = testEfficiancy(stopSignMap);
  trafficLightefficiancy = testEfficiancy(trafficLightMap);

  console.log("road values: ", roads[0], roads[1], roads[2], roads[3]);

  if (
    roundaboutEfficiancy >= stopSignEfficiancy &&
    roundaboutEfficiancy >= trafficLightefficiancy
  ) {
    console.log("A roundabout is the most efficiant solution");
  } else if (stopSignEfficiancy >= trafficLightefficiancy) {
    console.log("A stop sign is the most efficiant solution");
  } else {
    console.log("A traffic light system is the most efficiant solution");
  }

  let totalRoadCPM = roads.reduce((i, j) => i + j);
  console.log("roundabout eff:", roundaboutEfficiancy, "RoundAbout CPM/$: ", IntersectionCosts.ROUND_ABOUT / totalRoadCPM);
  console.log("traffic light eff:", trafficLightefficiancy, "Traffic Light CPM/$:", IntersectionCosts.TRAFFIC_LIGHTS / totalRoadCPM);
  console.log("stop sign eff:", stopSignEfficiancy, "Stop Sign CPM/$:",IntersectionCosts.STOP_SIGN / totalRoadCPM);

  return;
}

//  UNCOMMENT TO TEST
findTrafficSolutionWithArgs();
// findTrafficSolutionFromCSV("./data.csv");
