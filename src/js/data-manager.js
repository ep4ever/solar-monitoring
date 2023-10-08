export default class DataManager {

  constructor(api, settings) {
    this.api = api
    this.settings = settings
    this.datas = []
    this.rowDatas = []
    this.reloadOn = false
    this.lastError = null
    this.batteryVoltage = null
    this.totalWatt = null
    this.totalCurrent = null
    this.containsData = false
    this.consumerData = {}
  }

  formatNumber(value) {
    return parseFloat(value).toLocaleString(
      this.settings.language,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    )
  }

  getReversedData() {
    return this.rowDatas.slice().reverse()
  }

  getIsAppendable() {
    return this.containsData && this.reloadOn
  }

  getDeviceList(device) {
    const deviceList = []
    if (device === 'all') {
      for (let i = 0; i < this.settings.devices.length; i += 1) {
        const d = this.settings.devices[i]
        deviceList.push(d.name)
      }
    } else {
      deviceList.push(device)
    }
    return deviceList
  }

  getTotalWatt() {
    return this.totalWatt
  }

  getTotalCurrent() {
    return this.totalCurrent
  }

  getBatteryVoltage() {
    if (isNaN(this.batteryVoltage)) {
      this.batteryVoltage = 0
    }
    return this.batteryVoltage.toFixed(2)
  }

  getConsumerData() {
    return this.consumerData
  }

  async load(device, source) {
    const deviceList = this.getDeviceList(device)
    const bIsAppend = this.datas.length > 0 && this.reloadOn
    let time
    if (bIsAppend) {
      // set the time argument from last element
      time = this.datas.at(-1).timestamp
    }

    let all = []
    if (deviceList.length === 1) {
      all = await this.api.getDeviceDatas(deviceList[0], source, time)
    } else {
      const deviceTokens = deviceList.join('_')
      all = await this.api.getDeviceDatas(deviceTokens, source, time)
    }
    if (!Array.isArray(all)) {
      if (
        typeof all === 'object'
        && Object.prototype.hasOwnProperty.call(all, 'error')
      ) {
        this.lastError = all.error
        this.containsData = false
        return false
      }
    }
    all.sort((a, b) => {
      if (a.timestamp > b.timestamp) {
        return 1
      }
      return -1
    })
    if (bIsAppend) {
      // in case we are appending check data integrity
      if (all.length % deviceList.length !== 0) {
        // partial results has been received we skip that frame
        // to keep device lines time synchronized
        console.warn("partial results received: skipping!")
      } else {
        // we add that data 0 size or a multiple of device list size
        this.datas = this.datas.concat(all)
      }
    } else {
      this.datas = all
    }

    this.rowDatas = this._flatten()
    await this._loadLatestCounter(device)

    // if there is no reported Data (aka: batteryVoltages not reported)
    if (! this.containsData) {
      // all previous Data wiped off (we are in nightenv mode)
      this.datas = []
      this.rowDatas = []
    }

    return true
  }

  _flatten() {
    const rowDatas = []
    this.datas.forEach((raw) => {
      if (typeof raw === 'undefined' || raw === '') {
        this.lastError = 'no data available'
        return
      }
      if (typeof raw.error !== 'undefined') {
        this.lastError = raw.error
        return
      }

      const row = {
        device: raw.device,
        timestamp: raw.timestamp,
        datestamp: raw.datestamp,
      }
      raw.data.forEach((subData) => {
        row[subData.field] = subData.value
      })
      rowDatas.push(row)
    });

    return rowDatas
  }

  async _loadLatestCounter(device) {
    this.batteryVoltage = 0
    this.totalWatt = 0
    this.totalCurrent = 0

    const batteryVoltages = []
    let ratedVoltage = 0

    const deviceCount = device === 'all' ? this.settings.devices.length : 1
    let upper = this.rowDatas.length - 1
    if (upper === 0) {
        upper = 1
    }
    const lower = upper - deviceCount;

    for (let i = lower; i < upper; i += 1) {
      const r = this.rowDatas[i]
      if (typeof r === 'undefined') {
        continue
      }

      ratedVoltage = parseFloat(r.battery_voltage)
      if (ratedVoltage > 0) {
        batteryVoltages.push(ratedVoltage)
      }

      this.totalWatt += parseFloat(r.rated_watt)
      this.totalCurrent += parseFloat(r.battery_current)
    }

    if (batteryVoltages.length > 0) {
      this.batteryVoltage = (
        batteryVoltages.reduce((partialSum, a) => partialSum + a, 0)
      ) / batteryVoltages.length
      this.containsData = true
    } else {
      // since no device has reported a voltage value
      this.batteryVoltage = await this.api.getNightEnvValue()
      this.datas = []
      this.rowDatas = []
      this.containsData = false
    }

    this.consumerData = await this.api.getConsumerData()
  }
}
