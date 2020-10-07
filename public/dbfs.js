class dbfs extends AudioWorkletProcessor {
  // static get parameterDescriptors() {
  //   return [{}];
  // }

  constructor() {
    super();
    this.level = 0;
    this.avg = 0;
    this.port.onmessage = () => {
      this.postMessage({
        level: this.level,
        avg: this.avg
      });
    };
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    var accumulator = 0;
    for (let channel = 0; channel < input.length; ++channel) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];

      for (let i = 0; i < inputChannel.length; ++i) {
        const abs = Math.abs(inputChannel[i]);
        this.level = abs > this.level ? abs : this.level;
        accumulator += abs;
        outputChannel[i] = inputChannel[i];
      }
    }

    this.avg = accumulator / input.length;

    return true;
  }
}

registerProcessor("db-fs", dbfs);
