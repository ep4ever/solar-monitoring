<template>
  <div
    class="card"
    :class="isFullScreen ? 'panel-fullscreen' : ''"
  >
    <div class="card-header">
      <ul class="list-group d-flex align-items-end">
        <a
          href="#"
          @click="isFullScreen = !isFullScreen"
        >
          <i
            class="fa-solid fa-up-right-and-down-left-from-center"
          />
        </a>
      </ul>
    </div>
    <div
      class="card-body"
      :class="[isFullScreen ? 'resizable-container-extended': 'resizable-container-normal', isDarkMode ? ' ep4ever-background-dark' : ' ep4ever-background-light']"
    >
      <div class="resizable-container-child">
        <ComponentLine
          ref="chartElement"
          :data="lineChartData"
          :options="chartOptions"
        />
      </div>
    </div>
  </div>
</template>

<script lang="js">

import { Line as ComponentLine} from 'vue-chartjs'
import { Chart as ChartJS, registerables } from 'chart.js'
import ChartData from '../js/chart-data'
import _ from 'lodash'

ChartJS.register(...registerables)

export default {
  name: 'LineChart',
  components: { ComponentLine },
  data() {
    return {
      lineChartData: {
        labels: [],
        datasets: [],
      },
      isFullScreen: false,
      isDarkMode: false,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        spanGaps: true,
        datasets: {
          line: {
            pointRadius: 0,
          },
        },
        scales: {
          x: {
            ticks: {
              color: this.isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
            }
          },
          y: {
            ticks: {
              color: this.isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
            }
          }
        },
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: false,
              },
              mode: 'xy',
            },
          },
          legend: {
            display: true,
            labels: {
              color: this.isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
            },
          },
          title: {
            display: true,
            text: '',
            color: this.isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
            font: {
              size: 18
            },
            padding: {
              top: 10,
              bottom: 10,
            },
          },
          subtitle: {
            display: true,
            color: this.isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
            text: '',
            font: {
              size: 14
            },
          },
        },
      },
      chartDate: new Date(),
    }
  },
  mounted() {
    this.chartData = new ChartData()
  },
  methods: {
    switchTheme(bDark) {
      this.isDarkMode = bDark
    },
    loadData(datas, settings) {
      this.chartData.init()

      const wasFullScreen = this.isFullScreen
      const wasDarkMode = this.isDarkMode
      Object.assign(this.$data, this.$options.data.call(this))
      this.isFullScreen = wasFullScreen
      this.isDarkMode = wasDarkMode

      if (datas.length === 0) {
        return
      }
      this.chartData.load(datas, this.isDarkMode)

      const ms = this.chartData.endTime - this.chartData.startTime
      const hourElapse = parseFloat(((ms / 1000) / 3600).toFixed(2))
      const averageWatts = this.chartData.totalValues / (datas.length / this.chartData.datasetCount)
      const kwh = (averageWatts * hourElapse) / 1000
      const kwhValue = kwh.toLocaleString(settings.language, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).concat(' kWh')

      this.chartOptions.plugins.title.text = 'production '.concat(kwhValue)
      this.chartOptions.plugins.subtitle.text = [
        this.chartData.chartDate.toLocaleDateString(),
        ' ',
        this.chartData.startTime.toLocaleTimeString(),
        ' - ',
        this.chartData.endTime.toLocaleTimeString()
      ].join('')

      this.lineChartData.labels = this.chartData.labels
      this.lineChartData.datasets = this.chartData.datasets
    },
  },
}
</script>
