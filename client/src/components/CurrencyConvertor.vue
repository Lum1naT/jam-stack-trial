<template>
  <div id="currency-convertor">
    <div class="inner-inputs">
      <p>
        Kurz pro zadané měny: <br />
        {{ state.current_rate }}
      </p>
      <!-- Currency From -->

      <select
        class="currency-select"
        name="currency-from"
        id="currency-from"
        v-model="state.currency_from"
      >
        <option v-for="(key, value) in state.list_of_currencies" :key="key">
          {{ value }}
        </option>
      </select>
      <!-- End of Currency From -->

      <span class="between-select" @click="swap(state)"
        ><img src="../assets/swap.png" class="swap-image" />
      </span>
      <!-- Currency To -->
      <select
        class="currency-select"
        name="currency-to"
        id="currency-to"
        v-model="state.currency_to"
      >
        <option v-for="(key, value) in state.list_of_currencies" :key="key">
          {{ value }}
        </option>
      </select>
      <!-- End of Currency To -->

      <br />
      <input
        type="number"
        placeholder="Enter a value"
        v-model="state.value_from"
        min="0"
        class="input-left"
      />
      <span> </span>
      <input
        type="number"
        placeholder="Converted value"
        disabled
        v-model="state.value_to"
        min="0"
        class="input-right"
      />
    </div>
    <button class="clipboard-span" @click="toClipboard(state.value_to)">
      <img src="../assets/clipboard.png" class="swap-image" />
    </button>
  </div>
</template>
<script>
import { reactive, watch } from 'vue';
import axios from 'axios';
import { toClipboard } from '@soerenmartius/vue3-clipboard';

export default {
  name: 'CurrencyConvertor',

  setup() {
    const state = reactive({
      currency_from: '',
      currency_to: '',
      value_from: 0,
      value_to: 0,
      list_of_currencies: {},
      rates: [],
      current_rate: 'Unknown',
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
            state.current_rate = response.data;
          } else {
            // TODO: Show error to user as an element
            alert(
              'Currency rate for ' +
                currency_from +
                ' and ' +
                currency_to +
                ' is less than 0.0000 or unknown. \n Try a different currency.'
            );
            state.current_rate = 'Unknown';
          }
        });
      return true;
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
    function refresh(input) {
      state.value_to = input;
    }
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
      refresh(result);

      return result;
    } // end of - func convert

    // modern way to write sleep function, apparently > makes sense, needs to be used within async func with await - line 165 & 204
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function get_rates_length() {
      return state.rates.length;
    }

    // watches changes on selects and inputs
    watch(
      () => [state.currency_from, state.currency_to, state.value_from],
      async () => {
        if (state.currency_from != '' && state.currency_to != '') {
          if (state.currency_from == state.currency_to) {
            // if currencies match, the values match as well
            state.value_to = state.value_from;
            //
          } else if (is_rate_known(state.currency_from, state.currency_to)) {
            // if the rate is known, convert the value

            // setting current_rate
            state.rates.forEach(function(data) {
              if (
                data.to == state.currency_to &&
                data.from == state.currency_from
              ) {
                // rounding -> 100 = 2 decimal places, 1000 = 3 DP, ...
                state.current_rate = data.rate;
              }
            });

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
            var original_length = get_rates_length();

            fetch_currency_rate(state.currency_from, state.currency_to);

            // this ensures that the rates change even when swapping them
            while (original_length == state.rates.length) {
              await sleep(100);
              console.log(original_length + ' - sleeping');
            }
            state.value_to = convert(
              state.currency_from,
              state.currency_to,
              state.value_from
            );
          }
        }
      }
    );

    return {
      state,
    };
  }, // end of setup

  methods: {
    swap(state) {
      var temp = state.currency_from;
      state.currency_from = state.currency_to;
      state.currency_to = temp;
    },
    toClipboard,
  },
};
</script>
<style scoped>
@import '../styles/style.css';
</style>
