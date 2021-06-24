<template>
  <div class="dataVisualizer">
    <div class="dataVisualizer__text">{{stateText}}</div>
    <div class="dataVisualizer__chart">
      <canvas id="arduino-chart"></canvas>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase/index.js'
import Chart from 'chart.js'

export default {
  data() {
    return {
      state: null,
      intervalState: null,
      isRunning: false,
      stateText: null,

      dataValues: {
        "temp" : null,
        "cardiac": null
      },
      datacollection: null,
      chart: null,
      count: 0,
      isOnce: true
    }
  },
  mounted() {
    this.$data.stateText = "En attente de données"
    this.checkDeviceState()
    this.getDeviceDatas()
    this.createChart()
  },
  methods: {
    checkDeviceState() {
      db
          .collection('user')
          .doc(this.$store.getters["auth/user"].data.uid)
          .collection('device')
          .doc('listener')
          .onSnapshot((doc) => {
            if(doc.data() !== undefined) {
              this.$data.state = doc.data().status
              if(this.$data.state !== 'nothing') {
                this.$data.stateText = "Recuperation de données"
              } else {
                this.$data.stateText = "En attente de données"
              }
            }
          })
    },
    getDeviceDatas() {
      db
          .collection('user')
          .doc(this.$store.getters["auth/user"].data.uid)
          .collection('device')
          .doc('temp')
          .onSnapshot((doc) => {
            if(doc.data() !== undefined) {
              if(doc.data().temperature !== undefined) {

                this.$data.dataValues.temp = doc.data().temperature
                this.$data.dataValues.cardiac = doc.data().cardiac

                if(this.isOnce) {
                  this.$data.dataValues.temp.forEach((item, index) => {
                    this.chart.data.labels.push(index);
                    this.count = index;
                  })
                  this.isOnce = false
                }

                this.chart.data.datasets[0].data = this.$data.dataValues.temp
                this.chart.data.datasets[1].data = this.$data.dataValues.cardiac
                this.chart.data.labels.push(this.count);
                this.count++
                this.chart.update()
              }
            }
          })
    },
    createChart() {
      const ctx = document.getElementById('arduino-chart');
      ctx.height = 500;
      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Temperatures",
              data: [],
              backgroundColor: "rgba(54,73,93,.5)",
              borderColor: "#36495d",
              borderWidth: 3
            },
            {
              label: "Cardiac",
              data: [],
              backgroundColor: "rgba(71, 183,132,.5)",
              borderColor: "#47b784",
              borderWidth: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          lineTension: 1,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                 //  padding: 25
                }
              }
            ]
          }
        }
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.dataVisualizer {
  width: 100%;
  height: 100%;
  padding: 4rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &__text {
    font-size: 5rem;
    color: $C-white;
    text-align: center;
  }
  &__chart {
    canvas {
      height: 100%;
    }
  }
  &__wrapper {
    display: flex;
    justify-content: space-evenly;
    margin-top: 5rem;
  }
  &__array {
    &__title {
      font-size: 2.5rem;
      color: $C-white;
      margin-bottom: 1.5rem;
    }
    &__item {
      color: $C-white;
      font-size: 3rem;
      text-align: center;
      margin-bottom: 1.5rem;
    }
  }
}
</style>