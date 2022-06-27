class SimulationWorker {
  constructor(onSuccess, onError) {
    this.worker = new Worker(`./dist/js/sim.worker.js?${Math.random()}`);

    this.worker.onerror = (...args) => {
      onError(...args);
      this.worker.terminate();
    };

    this.worker.onmessage = (event) => {
      const { data } = event;
      if (data.type == 'error') {
        onError(data);
      }
      if (data.type == 'success') {
        onSuccess(data.result);
      }
      this.worker.terminate();
    };
  }

  start(config, iterations) {
    this.worker.postMessage({
      type: 'start',
      config,
      iterations: iterations || 1,
    });
  }
}
export default SimulationWorker;
