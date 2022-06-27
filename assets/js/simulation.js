import SimulationWorker from './SimulationWorker';

class SimulationWorkers {
  constructor(iterations, onSuccess, onError) {
    this.threads = navigator.hardwareConcurrency || 2;
    this.workers = Array(this.threads);
    this.iterations = iterations;

    let sum = null;

    for (let i = 0; i < this.threads; i += 1) {
      this.workers[i] = new SimulationWorker((result) => {
        if (!sum) {
          sum = result;
        } else {
          if (result.min_dps < sum.min_dps) {
            sum.min_dps = result.min_dps;
          }
          if (result.max_dps > sum.max_dps) {
            sum.max_dps = result.max_dps;
          }
          sum.avg_dps = (sum.avg_dps * sum.iterations + result.avg_dps * result.iterations)
            / (sum.iterations + result.iterations);
          sum.iterations += result.iterations;

          if (result.histogram) {
            for (const key in result.histogram) {
              if (!Object.prototype.hasOwnProperty.call(sum.histogram, key)) {
                sum.histogram[key] = result.histogram[key];
              } else {
                sum.histogram[key] += result.histogram[key];
              }
            }
          }

          if (result.stats) {
            if (result.stats.evocated.n) {
              sum.stats.evocated.t = (
                sum.stats.evocated.t * sum.stats.evocated.n
                    + result.stats.evocated.t * result.stats.evocated.n
              ) / (sum.stats.evocated.n + result.stats.evocated.n);
              sum.stats.evocated.n += result.stats.evocated.n;
            }
            if (result.stats.regened.n) {
              sum.stats.regened.t = (
                sum.stats.regened.t * sum.stats.regened.n
                  + result.stats.regened.t * result.stats.regened.n
              ) / (sum.stats.regened.n + result.stats.regened.n);
              sum.stats.regened.n += result.stats.regened.n;
            }
            sum.stats.t_gcd_capped = (
              sum.stats.t_gcd_capped * sum.iterations
              + result.stats.t_gcd_capped * result.iterations
            ) / (sum.iterations + result.iterations);
          }
        }

        if (sum.iterations === iterations) {
          onSuccess(sum);
        }
      }, (error) => {
        console.error(error);
      });
    }
  }

  start(config) {
    const seed = config.rng_seed;
    for (let i = 0; i < this.workers.length; i += 1) {
      let it = this.iterations / this.threads;
      const r = this.iterations % this.threads;
      if (r && i < r) {
        it += 1;
      }
      if (config.rng_seed > 0) {
        config.rng_seed += it;
      }
      this.workers[i].start(config, it);
    }
    config.rng_seed = seed;
  }
}

export { SimulationWorker, SimulationWorkers };
