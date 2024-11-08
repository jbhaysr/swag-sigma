<script setup lang="ts">
import { ref } from 'vue'
import FilteredTable from './FilteredTable.vue';

const query = ref('')

function reset() {
  query.value = ''
}
</script>

<template>
  <h3>User List</h3>
  <input type="text" placeholder="Filter Users" v-model="query" />
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
