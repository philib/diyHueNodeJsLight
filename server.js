var express = require("express");
var path = require("path");
var colorConverter = require("cie-rgb-color-converter");

const lightDefaults = {
  name: "diyHue Light",
  protocol: "native_single",
  modelid: "LCT015",
  type: "rgb",
  version: 3.0,
};

exports.start = (lightName, macAddress, onStateChange, port = 80) => {
  var hueState = {
    on: true,
    bri: 150,
    xy: [0.32, 0.32],
    ct: 230,
    transitiontime: 0,
    alert: "none",
    effect: "none",
  };
  var rgbState = {
    r: 0,
    g: 0,
    b: 0,
  };

  var app = express();
  app.use(express.json());

  app.get("/", (_, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
  });

  app.get("/detect", (_, res) => {
    console.log("detected");
    var response = {
      ...lightDefaults,
      name: lightName,
      mac: macAddress,
    };
    res.send(response);
  });

  app.get("/state", (_, res) => {
    console.log("get state");
    res.send(hueState);
  });

  app.put("/state", (req, res) => {
    hueState = { ...hueState, ...req.body };
    rgbState = colorConverter.xyBriToRgb(
      hueState.xy[0],
      hueState.xy[1],
      hueState.bri
    );
    onStateChange(rgbState);
    res.send(hueState);
  });

  app.get("/color", (req, res) => {
    res.send(
      `
	    <!DOCTYPE html>
	    <html back>
	    <style>
	    html {
		        background-color: rgb(${rgbState.r}, ${rgbState.g}, ${rgbState.b});
	    }
	    </style>
	    </html>

	    `
    );
  });
  app.listen(port);
};
