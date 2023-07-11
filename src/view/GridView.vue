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
          <i class="fa-solid fa-up-right-and-down-left-from-center" />
        </a>
      </ul>
    </div>
    <div
      class="card-body"
      :class="[isFullScreen ? 'resizable-container-extended': 'resizable-container-normal', isDarkMode ? 'ep4ever-background-dark' : 'ep4ever-background-light']"
    >
      <div class="resizable-container-child">
        <div
          class="row"
          :class="isDarkMode ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
        >
          <ag-grid-vue
            :class="[isFullScreen ? 'resizable-container-extended-table': 'resizable-container-normal-table', isDarkMode ? 'ag-theme-alpine-dark' : 'ag-theme-alpine']"
            :column-defs="columnDefs"
            :row-data="getRowData()"
            :pagination="true"
            @grid-ready="onGridReady"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { AgGridVue } from 'ag-grid-vue3';
import GridViewAdapter from '../js/gridview-adapter'

export default {
  name: 'GridView',
  components: {
    AgGridVue,
  },
  props: [],
  data() {
    return {
      isFullScreen: false,
      isDarkMode: false,
      adapter: null,
      columnDefs: [],
      rowData: [],
      rowDataFiltered: [],
      gridApi: null,
      gridColumnApi: null,
      device: null,
    }
  },
  computed: {
    agGridClass() {
      if (this.isFullScreen) {
        return 'resizable-container-extended-table'
      }
      return 'resizable-container-normal-table'
    },
    filtering() {
      return this.rowDataFiltered.length > 0
    },
  },
  watch: {
    rowDataFiltered() {
      if (this.gridApi !== null) {
        this.gridApi.redrawRows()
      }
    },
  },
  mounted() {
    this.adapter = new GridViewAdapter(this.settings, this.api)
    this.columnDefs = this.adapter.getColumnsDef(this.$t)
  },
  methods: {
    update(datas, device) {
      this.device = device
      this.rowData = datas
      this.rowDataFiltered = []
    },
    getRowData(bReverse = false) {
      if (this.filtering) {
        if (bReverse) {
          return this.rowDataFiltered.slice().reverse()
        }
        return this.rowDataFiltered.slice()
      }
      if (bReverse) {
        return this.rowData.slice().reverse()
      }
      return this.rowData.slice()
    },
    getTimeStart() {
      if (this.rowData.length === 0) {
        return '00:00:00'
      }
      const lastRow = this.rowData[this.rowData.length - 1]
      return lastRow.timestamp
    },
    getTimeEnd() {
      if (this.rowData.length === 0) {
        return '00:00:00'
      }
      const firstRow = this.rowData[0]
      return firstRow.timestamp
    },
    setFiltering(timeStart, timeEnd) {
      this.rowDataFiltered = this.rowData.filter((el) => (
        el.timestamp >= timeStart && el.timestamp <= timeEnd
      ))
    },
    onGridReady(params) {
      this.gridApi = params.api
      this.gridColumnApi = params.columnApi
    },
    exportGrid() {
      const lfileName = new Date().toJSON().slice(0, 10)
        .concat('_')
        .concat(this.device)
        .concat('.csv')
      this.gridApi.exportDataAsCsv({
        fileName: lfileName,
      });
    },
    switchTheme(isDark) {
      this.isDarkMode = isDark
    },
  },
}
</script>
