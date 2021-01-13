<template>
  <CurrencyConvertor />
</template>

<script>
import CurrencyConvertor from './components/CurrencyConvertor.vue';

export default {
  name: 'App',
  components: {
    CurrencyConvertor,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
