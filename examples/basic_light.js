const diyHueLight = require("../server");
const Gpio = require("pigpio").Gpio;
const red = new Gpio(22, { mode: Gpio.OUTPUT });
const green = new Gpio(27, { mode: Gpio.OUTPUT });
const blue = new Gpio(17, { mode: Gpio.OUTPUT });

const onStateChange = (state) => {
  red.pwmWrite(state.r);
  green.pwmWrite(state.g);
  blue.pwmWrite(state.b);
};

diyHueLight.start("Entertainment Light", "b0:30:f5:6a:6a:4a", () => {}, 80);
