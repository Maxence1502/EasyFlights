<template>
  <div id="app">
    <Map/>
    <Search/>
  </div>
</template>

<script>
import Map from './components/Map.vue';
import Search from './components/Search.vue';

export default {
  name: 'App',
  components: {
    Map,
    Search
  }
}
</script>
