<template>
  <div v-show="nightMode">
    <div
      v-show="batteryVoltage !== ''"
      class="container h-100 text-center"
    >
      <div
        style="font-size: 96pt;color: darkslategrey"
        class="row h-100"
      >
        <form class="col-12">
          <div class="form-group">
            <label>{{ batteryVoltage }} V</label>
          </div>
          <div class="form-group">
            <label>{{ timestamp }}</label>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div v-show="!nightMode">
    <div class="container-fluid ep4ever-navbar-container">
      <nav
        id="ep4ever-navbar"
        class="navbar"
      >
        <a
          class="navbar-brand"
          href="#"
        >
          <span>{{ $t('message.solar_station_title') }}</span>
        </a>
        <div class="col-lg-7">
          <span class="badge bg-secondary p-2">
            <i class="fa-solid fa-car-battery" />
            &nbsp;{{ batteryVoltage }} V
          </span>&nbsp;
          <span class="badge bg-secondary p-2">
            <i class="fa-solid fa-solar-panel" />
            &nbsp;{{ totalWatt }} W
          </span>&nbsp;
          <span class="badge bg-secondary p-2">
            <i class="fa-solid fa-bolt" />
            &nbsp;{{ totalCurrent }} A
          </span>
        </div>
      </nav>
    </div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-6">
          <div class="row m-1">
            <div
              class="col-sm-4"
              align="right"
            >
              <label
                for="device_list"
                class="label"
              >
                {{ $t('message.device') }}
              </label>
            </div>
            <div class="col-sm-4">
              <select
                id="device_list"
                v-model="selectedDevice"
                class="form-select form-select-sm"
                @change="(event) => selectedDeviceChange(event)"
              >
                <option
                  disabled
                  value=""
                >
                  ...
                </option>
                <option value="all">
                  {{ $t('message.all') }}
                </option>
                <option
                  v-for="option in devices"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.text }}
                </option>
              </select>
            </div>
            <div class="col-sm-4 text-end">
              <button
                class="btn btn-secondary btn-sm"
                @click="onBtnEditConfigurationClick"
              >
                <i class="fa-solid fa-cog" />
                Edit configuration...
              </button>
            </div>
          </div>
          <div class="row m-1">
            <div
              class="col-sm-4"
              align="right"
            >
              <label
                for="datasource_list"
                class="label"
              >
                {{ $t('message.datasource') }}
              </label>
            </div>
            <div class="col-sm-4">
              <select
                id="datasource_list"
                v-model="selectedDatasource"
                class="form-select form-select-sm"
                @change="(event) => selectedSourceChange(event)"
              >
                <option
                  selected
                  value="today"
                >
                  {{ $t('message.live') }}
                </option>
                <option
                  v-for="option in datasources"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ new Date(option.text).toLocaleDateString() }}
                </option>
              </select>
            </div>
            <div class="col-sm-4">
              &nbsp;
            </div>
          </div>
          <div class="row p-2">
            <div class="col-md-4">
              <button
                class="btn btn-secondary btn-sm"
                @click="onBtnExport"
              >
                <i class="fa-solid fa-file-csv" />
                {{ $t('message.download') }}
              </button>
            </div>
            <div class="col-md-4">
              <div class="form-check form-switch">
                <input
                  id="reloadDisableCheck"
                  v-model="reloadOn"
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  :disabled="reloadDisable || initializationMode"
                >
                <label
                  class="form-check-label"
                  for="reloadDisableCheck"
                >
                  {{ $t('message.auto_reload') }}
                </label>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-check form-switch">
                <input
                  id="darkModeCheck"
                  v-model="darkMode"
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                >
                <label
                  class="form-check-label"
                  for="darkModeCheck"
                >
                  {{ $t('message.dark_mode') }}
                </label>
              </div>
            </div>
            <div
              class="col-md-1 m-0"
              style="height: 40px"
            >
              <div
                v-show="isLoading"
                class="spinner-border"
                role="status"
              >
                <span class="sr-only" />
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="row p-1">
            <div
              class="col-sm-4"
              align="right"
            >
              <label
                for="time_start_input"
                class="label"
              >
                {{ $t('message.time_start') }}
              </label>
            </div>
            <div class="col-sm-6">
              <input
                v-model="timeStart"
                type="time"
                :disabled="graphicsScrollBy > 0"
                class="form-control"
              >
            </div>
            <div class="col-sm-2 d-grid">
              <button
                class="btn btn-secondary btn-sm"
                :disabled="reloadOn || initializationMode"
                @click="reload"
              >
                {{ $t('message.reload') }}
              </button>
            </div>
          </div>
          <div class="row p-1">
            <div
              class="col-sm-4"
              align="right"
            >
              <label
                for="time_end_input"
                class="label"
              >
                {{ $t('message.time_end') }}
              </label>
            </div>
            <div class="col-sm-6">
              <input
                v-model="timeEnd"
                type="time"
                class="form-control"
              >
            </div>
            <div class="col-sm-2 d-grid">
              <button
                :disabled="reloadOn || initializationMode"
                class="btn btn-secondary btn-sm"
                @click="updateTimeRange"
              >
                {{ $t('message.set') }}
              </button>
            </div>
          </div>
          <div class="row p-1">
            <div
              class="col-sm-4"
              align="right"
            >
              <label
                for="scroll_by_list"
                class="label"
              >
                {{ $t('message.scroll_by_label') }}
              </label>
            </div>
            <div class="col-sm-6">
              <select
                id="scroll_by_list"
                v-model="graphicsScrollBy"
                :disabled="!reloadOn"
                class="form-select form-select-sm"
                @change="(event) => graphicsScrollByChange(event)"
              >
                <option
                  v-for="item in graphicsScrollByList"
                  :key="item.key"
                  :value="item.value"
                >
                  {{ item.key }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="row p-1">
        <div class="col-lg-6">
          <GridView ref="grid" />
        </div>
        <div class="col-lg-6">
          <ChartLineView ref="chart" />
        </div>
      </div>
    </div>
  </div>
  <DlgConfig ref="dlgconfig" />
</template>

<script lang="js">

import DataManager from '../js/data-manager'
import GridView from './GridView.vue'
import ChartLineView from './ChartLineView.vue'
import DlgConfig from './DlgConfig.vue'

export default {
  name: 'App',
  components: {
    GridView,
    ChartLineView,
    DlgConfig,
  },
  props: [],
  data() {
    return {
      timestamp: '',
      initializationMode: false,
      windowHeight: window.innerHeight,
      reload_timeout: 10000,
      reloadPid: null,
      reloadOn: false,
      isLoading: false,
      selectedDevice: '',
      selectedDatasource: 'today',
      devices: [],
      deviceDatas: [],
      datasources: [],
      totalWatt: '',
      totalCurrent: '',
      batteryVoltage: '',
      timeStart: null,
      timeEnd: null,
      darkMode: false,
      dataManager: null,
      missingAppendDataCount: 0,
      graphicsScrollByList: [
        {key: '...', value: 0},
        {key: '30mn', value: 30},
        {key: '1h', value: 60},
        {key: '1h30', value: 90},
        {key: '2h', value: 120},
      ],
      graphicsScrollBy: 0,
    }
  },
  computed: {
    reloadDisable() {
      return this.selectedDevice === '' || (this.selectedDatasource === '' || this.selectedDatasource !== 'today')
    },
    activePort() {
      let label = ''
      if (this.selectedDevice !== '' && this.selectedDevice !== 'all') {
        this.settings.devices.forEach((device) => {
          if (this.selectedDevice === device.name) {
            label = device.port
          }
        })
      }
      return label
    },
    nightMode() {
      if (!this.isOnStage(this.dataManager)) {
        // if no manager loaded use it has a overlay
        return true
      }
      return this.dataManager.containsData === false
    },
  },
  watch: {
    reloadOn(before) {
      this.dataManager.reloadOn = before
      clearTimeout(this.reloadPid)
      if (before) {
        this.reload()
      } else {
        this.graphicsScrollBy = 0
      }
    },
    darkMode(value) {
      this.switchTheme(value)
    },
  },
  async mounted() {
    const deviceList = await this.api.getDeviceList()
    if (deviceList.length === 0) {
      this.initializationMode = true
    }
    deviceList.forEach((name) => {
      this.devices.push({ text: name, value: name })
    })
    const dataSourceList = await this.api.getDatasourceList()
    dataSourceList.forEach((name) => {
      this.datasources.push({ text: name, value: name })
    })
    // this.switchTheme(false)
    this.$nextTick(async () => {
      window.addEventListener('resize', this.onResize)
      this.selectedDevice = 'all'
      await this.reload()
      this.darkMode = true
      this.reloadOn = true
    })
    this.dataManager = new DataManager(this.api, this.settings)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    getNow() {
        const today = new Date();
        this.timestamp = today.toLocaleTimeString(
          window.navigator.language,
          {
            hour: '2-digit', minute: '2-digit'
          }
        )
    },
    onResize() {
      this.windowHeight = window.innerHeight
    },
    async selectedDeviceChange() {
      this.reloadOn = false
      await this.reload()
    },
    async selectedSourceChange() {
      this.reloadOn = false
      if (this.selectedDevice) {
        await this.reload()
      }
    },
    async graphicsScrollByChange() {
      if (this.graphicsScrollBy === 0) {
        this.timeStart = '02:00:00'
        return await this.reload()
      }
      this.timeStart = this.getElapsedTimeValue()
    },
    getElapsedTimeValue() {
      const today = new Date()
      const elapsed = new Date(today - this.graphicsScrollBy * 60000)
      return elapsed.toLocaleTimeString()
    },
    async reload() {
      this.isLoading = true
      const loaded = await this.dataManager.load(this.selectedDevice, this.selectedDatasource)
      if (!loaded) {
        // something wrong on service side
        console.warn(this.dataManager.lastError)
      }

      let value = this.dataManager.getBatteryVoltage()
      this.batteryVoltage = this.dataManager.formatNumber(value)

      if (this.dataManager.containsData === false) {
        this.getNow()
        if (this.isOnStage(this.$refs.grid)) {
          this.$refs.grid.update([], this.selectedDevice)
        }
        if (this.isOnStage(this.$refs.chart)) {
          this.$refs.chart.loadData([], this.settings)
        }
        this.timeStart = null
        this.timeEnd = null
        this.totalCurrent = this.dataManager.formatNumber(0)
        this.totalWatt = this.dataManager.formatNumber(0)
      } else {
        // unsure timeStart has a value
        if (this.timeStart === null) {
          this.timeStart = this.$refs.grid.getTimeStart()
        }
        if (this.graphicsScrollBy > 0) {
          this.timeStart = this.getElapsedTimeValue()
        }
        const bIsAppendable = this.dataManager.getIsAppendable()
        this.$refs.grid.update(this.dataManager.getReversedData(), this.selectedDevice)
        this.timeEnd = this.$refs.grid.getTimeEnd()
        if (this.timeStart < this.$refs.grid.getTimeStart() ||
          !bIsAppendable
        ) {
          // prevent from getting bellow data start time
          this.timeStart = this.$refs.grid.getTimeStart()
        }
        if (bIsAppendable) {
          // update the filtering array for chart
          this.$refs.grid.setFiltering(this.timeStart, this.timeEnd)
        }
        this.$refs.chart.loadData(this.$refs.grid.getRowData(true), this.settings)

        value = this.dataManager.getTotalWatt()
        this.totalWatt = this.dataManager.formatNumber(value)

        value = this.dataManager.getTotalCurrent()
        this.totalCurrent = this.dataManager.formatNumber(value)
      }

      this.isLoading = false

      clearTimeout(this.reloadPid)

      if (this.reloadOn) {
        const t = setTimeout(() => {
          this.reload()
        }, this.reload_timeout)
        this.reloadPid = t
      }
    },
    onBtnExport() {
      if (this.isOnStage(this.$refs.grid)) {
        this.$refs.grid.exportGrid()
      }
    },
    onBtnEditConfigurationClick() {
      this.$refs.dlgconfig.showEditor()
    },
    updateTimeRange() {
      this.$refs.grid.setFiltering(this.timeStart, this.timeEnd)
      this.$refs.chart.loadData(
        this.$refs.grid.getRowData(true),
        this.dataManager.getDeviceList(this.selectedDevice),
        this.settings,
      )
    },
    switchTheme(isDark) {
      const rootHtml = document.getElementsByTagName('html')[0]
      rootHtml.setAttribute('data-bs-theme', isDark ? 'dark' : 'normal')
      if (this.isOnStage(this.$refs.grid) && this.isOnStage(this.$refs.chart)) {
        this.$refs.grid.switchTheme(isDark)
        this.$refs.chart.switchTheme(isDark)
        // reload data to redraw lines
        this.$refs.chart.loadData(this.$refs.grid.getRowData(true), this.settings)
      }
    },
  },
}
</script>
