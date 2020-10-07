class dbfs extends AudioWorkletProcessor {
  // static get parameterDescriptors() {
  //   return [{}];
  // }

  constructor() {
    super();
    this.level = [];
    this.avg = [];
    this.port.onmessage = () => {
      this.port.postMessage({
        level: this.level,
        avg: this.avg
      });
    };
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    var maxLevel = []
    for (let channel = 0; channel < input.length; ++channel) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];
      var accumulator = 0;
      var maxLevel = 0;
      this.level[channel] = 0;
      this.avg[channel] = 0;
      for (let i = 0; i < inputChannel.length; ++i) {
        const abs = Math.abs(inputChannel[i]);
        maxLevel = abs > maxLevel ? abs : maxLevel;
        accumulator += abs;
        outputChannel[i] = inputChannel[i];
      }
      this.level[channel] = maxLevel;
      this.avg[channel] = accumulator / inputChannel.length;
    }
    return true;
  }
}

registerProcessor("db-fs", dbfs);
