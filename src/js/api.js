import axios from 'axios'

export default class Api {
  api

  constructor(apiUrl) {
    this.api = axios.create({
      baseURL: apiUrl,
      timeout: 10000,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    })
  }

  async getApiConfig() {
    const response = await this.api.get('/config')
    return response.data
  }

  async getDeviceList() {
    try {
      const response = await this.api.get('/device/list')
      return response.data
    } catch {
      return []
    }
  }

  async saveDeviceConfig(deviceData) {
    const json = JSON.stringify(deviceData)
    const response = await this.api.post('/device/edit', json)
    return response
  }

  async getDeviceDatas(deviceName, inDate, inTime) {
    if (deviceName === '') {
      return []
    }
    let dateArgs = inDate
    if (inDate === 'today') {
      dateArgs = new Date().toISOString().substring(0, 10)
    }

    const queryArgs = ['date='.concat(dateArgs)]

    if (typeof inTime !== 'undefined' && inTime !== null) {
      queryArgs.push('time='.concat(inTime))
    }
    const strArgs = queryArgs.join('&')

    try {
      const response = await this.api.get('/device/'.concat(deviceName).concat('?').concat(strArgs))
      return response.data.result
    } catch {
      return []
    }
  }

  async getDatasourceList() {
    const dataSourceList = []
    try {
      const response = await this.api.get('/datasource_list')
      response.data.forEach((el) => {
        dataSourceList.push(el)
      })
      return dataSourceList
    } catch {
      return []
    }
  }

  async getNightEnvValue() {
    try {
      const response = await this.api.get('/nightenv')
      return response.data
    } catch(e) {
      console.warn(e)
      return '0'
    }
  }
}
