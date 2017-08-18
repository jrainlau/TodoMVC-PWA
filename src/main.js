import Vue from 'vue'
import App from './App.vue'
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

if (process.env.NODE_ENV === 'production') {
  OfflinePluginRuntime.install({
    onUpdateReady () {
      OfflinePluginRuntime.applyUpdate()
    },
    onUpdated () {
      window.location.reload()
    }
  })
}

new Vue({
  el: '.todoapp',
  render: h => h(App)
})
