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
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <LoginSignupForm />
  </nav>
  <RouterView />
  <p v-if="users > 0">There are {{ users }} users with an average of {{ averageFriendsPerUser }} friends per user.</p>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
