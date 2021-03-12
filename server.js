const express = require("express");
const path = require("path");
const colorConverter = require("cie-rgb-color-converter");
const dgram = require("dgram");

const lightDefaults = {
  name: "diyHue Light",
  protocol: "native_single",
  modelid: "LCT015",
  type: "rgb",
  version: 3.0,
};

exports.start = (lightName, macAddress, onStateChange, port = 80) => {
  const entertainmentServer = dgram.createSocket("udp4");
  entertainmentServer.on("message", (msg, _) => {
    rgbState = {
      r: msg.readUInt8(1),
      g: msg.readUInt8(2),
      b: msg.readUInt8(3),
    };
    onStateChange(rgbState);
  });
  entertainmentServer.bind(2100);

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

  var hueApi = express();
  hueApi.use(express.json());

  hueApi.get("/", (_, res) => {
    res.sendFile(path.join(__dirname + "/color.html"));
  });

  hueApi.get("/detect", (_, res) => {
    console.log("detected");
    var response = {
      ...lightDefaults,
      name: lightName,
      mac: macAddress,
    };
    res.send(response);
  });

  hueApi.get("/state", (_, res) => {
    console.log("get state");
    res.send(hueState);
  });

  hueApi.put("/state", (req, res) => {
    hueState = { ...hueState, ...req.body };
    rgbState = colorConverter.xyBriToRgb(
      hueState.xy[0],
      hueState.xy[1],
      hueState.bri
    );
    onStateChange(rgbState);
    res.send(hueState);
  });

  hueApi.post("/rgb", (req, res) => {
    rgbState = req.body;
    onStateChange(req.body);
    res.send(req.body);
  });

  hueApi.get("/rgb", (req, res) => {
    res.send(rgbState);
  });

  hueApi.listen(port);
};
