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
      value_from: 0,
      value_to: 0,
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
          if (response.data != 0.0) {
            state.rates.push({
              from: currency_from,
              to: currency_to,
              rate: response.data,
            });
          } else {
            // TODO: Show error to user as an element
            alert(
              'Currency rate for ' +
                currency_from +
                ' and ' +
                currency_to +
                ' is less than 0.0000 or unknown. \n Try a different currency.'
            );
          }
        });
      console.log(state.rates);
    } // end of - func fetch_currency_rate

    function is_rate_known(currency_from, currency_to) {
      // gets conversion data from state.rates
      var array = state.rates;
      var result = false;

      array.forEach(function(data) {
        // itterate thru arrays and find match of rates
        if (result) return;

        if (data.to == currency_to && data.from == currency_from) {
          console.log('yes!');
          result = true;
        }
      });
      return result;
    } // end of - func is_rate_known

    function convert(currency_from, currency_to, value) {
      var array = state.rates;
      var result = 0;
      // gets conversion data from state.rates
      //
      array.forEach(function(data) {
        if (data.to == currency_to && data.from == currency_from) {
          console.log(data.rate);
          result = data.rate * value;
          // rounding -> 100 = 2 decimal places, 1000 = 3 DP, ...
          result = Math.round((result + Number.EPSILON) * 100) / 100;
        }
      });
      return result;
    } // end of - func convert

    // watches changes on selects and inputs
    watch(
      () => [state.currency_from, state.currency_to, state.value_from],
      () => {
        if (state.currency_from == state.currency_to) {
          // if currencies match, the values match as well
          state.value_to = state.value_from;
          //
        } else if (is_rate_known(state.currency_from, state.currency_to)) {
          // if the rate is known, convert the value
          state.value_to = convert(
            state.currency_from,
            state.currency_to,
            state.value_from
          );
        } else {
          // if the rate is unknown yet, fetch currency data
          console.log(
            'fetching currency rate of ' +
              state.currency_from +
              ' and ' +
              state.currency_to
          );
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
