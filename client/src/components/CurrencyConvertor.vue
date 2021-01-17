<template>
  <div id="currency-convertor">
    <p>
      <small>{{}}</small>
    </p>
    <!-- Currency From -->

    <select
      name="cuurency_from"
      id="currency_from"
      v-model="state.currency_from"
    >
      <option v-for="(key, value) in state.list_of_currencies" :key="key">
        {{ value }}
      </option>
    </select>
    <!-- End of Currency From -->

    <span> </span>
    <!-- Currency To -->
    <select name="currency_to" id="currency_to" v-model="state.currency_to">
      <option v-for="(key, value) in state.list_of_currencies" :key="key">
        {{ value }}
      </option>
    </select>
    <!-- End of Currency To -->

    <br />
    <input
      type="number"
      placeholder="currency_value"
      v-model="state.value_from"
    />
    <span> </span>
    <input
      type="number"
      placeholder="currency_value"
      disabled
      v-model="state.value_to"
    />
  </div>
</template>
<script>
import { reactive, watch } from 'vue';
import axios from 'axios';

export default {
  name: 'CurrencyConvertor',

  setup() {
    const state = reactive({
      currency_from: 'USD',
      currency_to: 'USD',
      value_from: 12,
      value_to: 23,
      list_of_currencies: {},
      rates: [],
    }); //end of state

    // fetches list of available currencies from the server
    function get_available_currencies() {
      //
      axios
        .get('http://localhost:2708/get-available-currencies')
        .then((response) => (state.list_of_currencies = response.data));
    }
    get_available_currencies();

    function fetch_currency_rate(currency_from, currency_to) {
      axios
        .get(
          'http://localhost:2708/currency-conversion/' +
            currency_from +
            '/' +
            currency_to
        )
        .then(function(response) {
          state.rates.push({
            from: currency_from,
            to: currency_to,
            rate_from_to: response.data,
            rate_to_from: 1 / response.data,
          });
        });
      console.log(state.rates);
    }

    function is_rate_known(currency_from, currency_to) {
      //

      var array = state.rates;
      // gets conversion data from state.rates
      array.forEach(function(data) {
        //
        if (data.to == currency_from && data.from == currency_to) {
          console.log('yes!');
          return true;
        }
        if (data.to == currency_to && data.from == currency_from) {
          console.log('yes!');
          return true;
        }
      });

      return false;
    }

    function convert(currency_from, currency_to, value) {
      var array = state.rates;
      // gets conversion data from state.rates
      //
      array.forEach(function(data) {
        if (data.to == currency_from && data.from == currency_to) {
          console.log(data.currency_from_to * value);
          return data.currency_to_from * value;
        }
        if (data.to == currency_to && data.from == currency_from) {
          console.log(data.currency_from_to * value);
          return data.currency_from_to * value;
        }
      });
      return 0;
    }

    // watches changes on selects and inputs
    watch(
      () => [state.currency_from, state.currency_to, state.value_from],
      () => {
        if (state.currency_from == state.currency_to) {
          state.value_to = state.value_from;
          console.log('currencies match!');
          //
        } else if (is_rate_known(state.currency_from, state.currency_to)) {
          // if the rate is already known by client
          state.value_to = convert(
            state.currency_from,
            state.currency_to,
            state.value_from
          );
        } else {
          // if the rate is unknown yet, fetch currency data
          fetch_currency_rate(state.currency_from, state.currency_to);
          state.value_to = convert(
            state.currency_from,
            state.currency_to,
            state.value_from
          );
        }
      }
    );

    return {
      state,
    };
  }, // end of setup
};
</script>
<style scoped></style>
