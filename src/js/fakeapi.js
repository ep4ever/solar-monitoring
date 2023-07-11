export default class FakeApi {
  getDeviceList () {
    return ['6420an']
  }

  getDatasourceList(){
    return [
    ]
  }

  getDeviceDatas() {
    return [
      {
        device: "6420an",
        timestamp: "18:33:39",
        datestamp: "2023-06-28",
        data: [
          {field: "device_temp", value: "32.88"},
          {field: "rated_voltage", value: "61.62"},
          {field: "rated_current", value: "1.66"},
          {field: "pv_rated_watt", value: "102.30"},
          {field: "battery_voltage", value: "14.23"},
          {field: "battery_current", value: "6.36"},
          {field: "rated_watt", value: "90.50"},
          {field: "battery_soc", value: "1.00"},
          {field: "load_voltage", value: "0.00"},
          {field: "load_current", value: "0.00"},
          {field: "load_watt", value: "40.00"}
        ]
      }
    ]
  }
  getNightEnvValue() {
    return 0
  }
}
