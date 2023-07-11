export default class ChartData {
  labels = []
  datasets = []
  chartDate = null
  startTime = null
  endTime = null
  datasetCount = 0
  totalValues = 0
  chartColorsLight = []
  chartColorsDark = []
  isDarMode = false

  constructor() {
    this.chartColorsLight = [
      'rgb(26, 35, 126)',
      'rgb(27, 94, 32)',
      'rgb(191, 54, 12)',
      'rgb(55, 71, 79)',
    ]
    this.chartColorsDark = [
      'rgb(79, 195, 247)',
      'rgb(139, 195, 74)',
      'rgb(255, 179, 0)',
      'rgb(255, 138, 101)',
    ]
  }

  init() {
    this.labels = []
    this.datasets = []
    this.chartDate = null
    this.startTime = null
    this.endTime = null
    this.datasetCount = 0
    this.totalValues = 0
    this.isDarkMode = false
  }

  load(datas, isDarkMode) {
    this.isDarkMode = isDarkMode
    if (!this.setChartDate(datas)) {
      return
    }
    this.setRange(datas)

    const byTimeArray = this.extractChartData(datas)
    let deviceDatas = {}

    for (const item in byTimeArray) {
      this.labels.push(item.slice(0, -3))
      const structAy = byTimeArray[item]
      structAy.forEach((el) => {
        if (typeof deviceDatas[el.device] === 'undefined') {
          deviceDatas[el.device] = []
        }
        deviceDatas[el.device].push(el.value)
        this.totalValues += parseFloat(el.value)
      })
    }
    for (const device in deviceDatas) {
      this.datasets.push(
        {
          label: device,
          data: deviceDatas[device],
          fill: false,
          borderColor: this.isDarkMode ? this.chartColorsDark[this.datasetCount] : this.chartColorsLight[this.datasetCount],
        },
      )
      this.datasetCount += 1
    }
  }

  extractChartData(datas) {
    const reduced = datas.reduce((acc, obj) => {
      const key = obj.timestamp
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({
        device: obj.device,
        value: obj.rated_watt
      })
      return acc
    }, {})
    return reduced
  }

  setChartDate(datas) {
    if (datas === 'undefined' || datas.length < 1) {
      return false
    }
    if (typeof datas[0].datestamp === 'undefined') {
      return false
    }
    this.chartDate = new Date(datas[0].datestamp)
    return true
  }

  setRange(datas) {
    const upper = datas.length -1
    const today = this.chartDate.toJSON().slice(0, 10)
    this.startTime = new Date(today.concat(' ').concat(datas[0].timestamp))
    this.endTime = new Date(today.concat(' ').concat(datas[upper].timestamp))
  }
}
