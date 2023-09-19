export default class GridViewAdapter {

  constructor(appSettings) {
    this.settings = appSettings
    this.useDateStampColumn = false
    this.valueFormatterNumber = (params) => this.numberFormatter(
      params.value,
      this.settings.language,
    )
    this.valueFormatterPct = (params) => this.pctFormatter(
      params.value,
      this.settings.language,
    )
  }

  getColumnsDef(trans) {
    const columns = [
      { field: 'device', headerName: trans('message.device'), width: 95 },
      { field: 'timestamp', headerName: trans('message.timestamp'), width: 95 },
    ]
    if (this.useDateStampColumn) {
      columns.push({
        field: 'datestamp',
        headerName: trans('message.datestamp'),
        width: 110,
        valueFormatter: ((params) => (new Date(params.date.dateStamp).toLocaleDateString())),
      })
    }

    this.settings.datas.forEach((f) => {
      columns.push({
        field: f.fieldname,
        headerName: trans('message.'.concat(f.fieldname)),
        width: f.width,
        type: 'rightAligned',
        valueFormatter: this[f.format],
      })
    })
    return columns
  }

  /* eslint-disable class-methods-use-this */
  numberFormatter(value, lng) {
    return parseFloat(value).toLocaleString(
      lng,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    )
  }

  pctFormatter(value) {
    return (parseFloat(value) * 100).toFixed(0).concat(' %')
  }
}
