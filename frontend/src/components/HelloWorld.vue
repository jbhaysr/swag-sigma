<script setup lang="ts">
import { ref } from 'vue'
import FilteredTable from './FilteredTable.vue';

const query = ref('')

function reset() {
  query.value = ''
}
</script>

<template>
  <h2>Filter Users</h2>
  <input type="text" placeholder="Filter Search" v-model="query" />
  <button @click="reset">Reset</button>
  <br/>
  <filtered-table :query="query" />
</template>

<style scoped>
  input[type='text'] {
    margin-bottom: 20px;
    padding: 10px;
  }
</style>
