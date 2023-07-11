export default class FakeConfig {
  datas = [
    {
        "fieldname": "device_temp",
        "width": 85,
        "format": "valueFormatterNumber"
    },
    {
        "fieldname": "rated_voltage",
        "width": 85,
        "format": "valueFormatterNumber"
    },
    {
        "fieldname": "rated_current",
        "width": 85,
        "format": "valueFormatterNumber"
    },
    {
        "fieldname": "rated_watt",
        "width": 85,
        "format": "valueFormatterNumber"
    },
    {
        "fieldname": "battery_voltage",
        "width": 85,
        "format": "valueFormatterNumber"
    },
    {
        "fieldname": "battery_current",
        "width": 85,
        "format": "valueFormatterNumber"
    },
    {
        "fieldname": "battery_soc",
        "width": 85,
        "format": "valueFormatterPct"
    },
    {
        "fieldname": "load_watt",
        "width": 85,
        "format": "valueFormatterNumber"
    }
  ]
  devices = [{
    name: '6420an',
    port: '/dev/ttyXRUSB0',
  }]
}
