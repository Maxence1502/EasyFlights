<template>
  <div id="app">
    <MglMap :accessToken="accessToken" :mapStyle="mapStyle" container="mainMap">
      <MglGeojsonLayer
        :sourceId="geoJsonSource.data.id"
        :source="geoJsonSource"
        layerId="somethingSomething"
        :layer="geoJsonLayer"
      />
    </MglMap>
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl'
import { MglMap, MglGeojsonLayer } from 'vue-mapbox/dist/vue-mapbox.umd.js'

export default {
  components: {
    MglMap,
    MglGeojsonLayer
  },
  data () {
    return {
      accessToken: 'pk.eyJ1IjoibWF4ZW5jZTE1MDIiLCJhIjoiY2w4b2dodHc2MDg0bDNucnVmcTJ2Y3hpOCJ9.IHfK8wgoNngWo4MwghLWDg',
      mapStyle: 'mapbox://styles/mapbox/streets-v11',
      //mapStyle: 'mapbox://styles/maxence1502/cl8oguj5f005u15mtf3121ka1',
      geoJsonSource: {
        type: 'geojson',
        data: {
          id: 'thisIsMySource',
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [102.0, 0.5]
              },
              properties: {
                id: 'value0'
              }
            }
          ]
        }
      },
      geoJsonLayer: {
        type: 'circle',
        paint: {
          'circle-color': 'red'
        }
      }
    }
  },
  created () {
    this.mapbox = Mapbox
  }
}
</script>

<style>
#mainMap {
  width: 100vw;
  height: 100vh;
}

.mapboxgl-ctrl-logo {
  display: none !important;
}

.mapboxgl-ctrl-attrib {
  display: none !important;
}
</style>
