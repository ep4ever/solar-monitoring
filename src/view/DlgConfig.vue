<template>
  <div>
    <div
      id="config_editor"
      class="modal"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ $t('message.dlg_title') }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="mb-3">
                <label
                  for="path_of_db_folder"
                  class="form-label"
                >
                {{ $t('message.dlg_db_path') }}
                </label>
                <input
                  id="path_of_db_folder"
                  v-model="editorSettings.db_folder"
                  type="text"
                  class="form-control"
                  placeholder=""
                >
              </div>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">
                    #
                  </th>
                  <th scope="col">
                    {{ $t('message.dlg_device_name') }}
                  </th>
                  <th scope="col">
                    {{ $t('message.dlg_device_port') }}
                  </th>
                  <th scope="col">
                    &nbsp;
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(device, index) in editorSettings.devices"
                  :key="index"
                >
                  <th scope="row">
                    {{ index }}
                  </th>
                  <td>
                    {{ device.name }}
                  </td>
                  <td>
                    {{ device.port }}
                  </td>
                  <td>
                    <button
                      class="btn btn-secondary btn-sm"
                      @click="onBtnDelDeviceClick(index)"
                    >
                      <i class="fa fa-solid fa-trash" />
                    </button>
                  </td>
                </tr>
                <tr>
                  <th>
                    <button
                      class="btn btn-secondary btn-sm"
                      @click="onBtnAddDeviceClick"
                    >
                      <i class="fa fa-solid fa-save" />
                    </button>
                  </th>
                  <td>
                    <input
                      v-model="newDeviceName"
                      class="form-control"
                      type="text"
                    >
                  </td>
                  <td>
                    <input
                      v-model="newDevicePort"
                      class="form-control"
                      type="text"
                    >
                  </td>
                </tr>
              </tbody>
            </table>
            <label class="label">{{ deviceError }}</label>
            <div class="row">
              <div class="mb-3">
                <label
                  for="path_of_night_env_file"
                  class="form-label"
                >
                  {{ $t('message.dlg_nightenv_file_path') }}
                </label>
                <input
                  id="path_of_night_env_file"
                  v-model="editorSettings.nightenv_filepath"
                  type="text"
                  class="form-control"
                  placeholder=""
                >
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
            {{ $t('message.dlg_close') }}
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="OnbtnConfigEditorSaveClick"
            >
              {{ $t('message.dlg_validate') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">

import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'

export default {
  name: 'DlgConfig',
  components: {},
  data() {
    return {
      activeEditor: null,
      editorSettings: {
        db_folder: '',
        nightenv_filepath: '',
        devices: [],
      },
      newDeviceName: '',
      newDevicePort: '',
      deviceError: '',
    }
  },
  computed: {

  },
  methods: {
    showEditor() {
      this.editorSettings = structuredClone(this.settings)
      const modal = document.getElementById('config_editor')
      this.activeEditor = new bootstrap.Modal(modal)
      const evClose = () => {
        modal.removeEventListener('hidden.bs.modal', evClose)
        this.activeEditor = null
      }
      modal.addEventListener('hidden.bs.modal', evClose)
      this.activeEditor.show()
    },
    async OnbtnConfigEditorSaveClick() {
      const response = await this.api.saveApiConfig(this.editorSettings)
      if (response.status === 200) {
        this.activeEditor.hide()
        window.location.reload()
      }
    },
    onBtnAddDeviceClick() {
      if (this.newDeviceName === '') {
        this.deviceError += 'le nom est obligatoire'
      }
      if (this.newDevicePort === '') {
        this.deviceError += ', le port est obligatoire'
      }
      if (this.deviceError !== '') {
        setTimeout(() => {
          this.deviceError = ''
        }, 2000);
        return;
      }
      this.editorSettings.devices.push({
        name: this.newDeviceName,
        port: this.newDevicePort,
      });
      this.newDeviceName = ''
      this.newDevicePort = ''
    },
    onBtnDelDeviceClick(index) {
      this.editorSettings.devices.splice(index, 1)
    },
  },
}
</script>
