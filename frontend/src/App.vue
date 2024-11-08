<script setup lang="ts">
import { ref } from 'vue';
import LoginSignupForm from './components/LoginSignupForm.vue'
import { RouterView, RouterLink } from 'vue-router';
import { getStats } from './helpers/user';

const users = ref(-1)
const averageFriendsPerUser = ref(-1)

async function getData() {
  const { userCount, avgFriends } = await getStats()
  users.value = userCount
  averageFriendsPerUser.value = avgFriends
}

getData()
</script>
<template>
  <header class="header row">
    <RouterLink class="nes-btn left" to="/">Home</RouterLink>
    <LoginSignupForm />
  </header>
  <RouterView />
  <p class="footer" v-if="users > 0">There are {{ users }} users with an average of {{ averageFriendsPerUser.toFixed(2) }} friends per user.</p>
</template>

<style>
.header {
  position: sticky;
  top: 0;
  padding: 20px;
  width: 100%;
  background-color: #fff;
  border-bottom: 2px solid #ccc;
  z-index: 10;
}

.footer {
  width: 100%;
  text-align: center;
  color: #999;
  border-top: 2px solid #ccc;
  margin-top: 10px;
  background: #fff;
}

.row {
  width: 100%;
}

.row::after {
  content: "";
  display: table;
  clear: both;
}

.left {
  float: left;
}

.right {
  float: right;
}

.center {
  margin: 0 auto;
  width: max-content;
}
</style>
