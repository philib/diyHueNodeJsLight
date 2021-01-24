var express = require("express");
var path = require("path");

const lightDefaults = {
  name: "diyHue Light",
  protocol: "native_single",
  modelid: "LCT015",
  type: "rgb",
  version: 3.0,
};

export const start = (lightName, macAddress, onStateChange, port = 80) => {
  var state = {
    on: true,
    bri: 150,
    xy: [0.32, 0.32],
    ct: 230,
    transitiontime: 0,
    alert: "none",
    effect: "none",
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
    res.send(state);
  });

  app.put("/state", (req, res) => {
    state = { ...state, ...req.body };
    onStateChange(state);
    res.send(state);
  });
  app.listen(port);
};
