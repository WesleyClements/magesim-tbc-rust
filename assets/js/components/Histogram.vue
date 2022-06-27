<template>
  <div class="histogram">
    <canvas ref="canvas" />
  </div>
</template>

<script>
import _ from 'lodash';
import { Bar } from 'vue-chartjs';

export default {
  mixins: [Bar],

  props: ['data'],

  watch: {
    data() {
      this.draw();
    },
  },

  mounted() {
    this.draw();
  },

  methods: {
    draw() {
      const binSize = 20;

      const data = {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: '#08f',
          borderColor: '#05c',
          borderWidth: 1,
          barPercentage: 1.25,
        }],
      };

      const keys = _.keys(this.data).sort((a, b) => a - b);
      const first = parseInt(keys[0], 10);
      const last = parseInt(_.last(keys), 10);
      let i;
      for (i = first; i <= last; i += binSize) {
        data.labels.push(i);
        data.datasets[0].data.push(_.get(this.data, i.toString(), '0'));
      }
      data.labels.push(i);

      const options = {
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
        scales: {
          xAxes: [
            {
              display: false,
              ticks: {
                max: data.labels[data.labels.length - 2],
              },
            },
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'DPS',
              },
              gridLines: {
                color: 'rgba(255,255,255,0.05)',
              },
              ticks: {
                autoSkip: false,
                max: data.labels[data.labels.length - 1],
              },
            },
          ],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Iterations',
            },
            gridLines: {
              color: 'rgba(255,255,255,0.05)',
            },
            ticks: {
              maxTicksLimit: 20,
              beginAtZero: true,
            },
          }],
        },
      };

      this.renderChart(data, options);
    },
  },
};
</script>
