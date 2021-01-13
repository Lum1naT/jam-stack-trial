<template>
  <div id="currency-convertor">
    <p>
      <small>{{ state.value_from }}</small>
    </p>
    <select
      name="cuurency_from"
      id="currency_from"
      v-model="state.currency_from"
    >
      <option value="volvo">Volvo</option>
      <option value="saab">Saab</option>
      <option value="mercedes">Mercedes</option>
      <option value="audi">Audi</option>
    </select>
    <span> </span>
    <select name="cuurency_to" id="currency_to">
      <option value="volvo">Volvo</option>
      <option value="saab">Saab</option>
      <option value="mercedes">Mercedes</option>
      <option value="audi">Audi</option>
    </select>
    <br />
    <input
      type="number"
      placeholder="currency_value"
      v-model="state.value_from"
    />
    <span> </span>
    <input type="number" placeholder="currency_value" v-model="to_value" />
  </div>
</template>
<script>
import { reactive } from 'vue';

export default {
  name: 'CurrencyConvertor',

  setup() {
    const state = reactive({
      currency_from: 'CZK',
      value_from: 12,
      currency_to: 'USD',
      value_to: 23,
    }); //end of state

    // fetches list of available currencies from the server
    function get_available_currencies() {
      //
    }
    return {
      state,
    };
  }, // end of setup
};
</script>
<style scoped></style>
