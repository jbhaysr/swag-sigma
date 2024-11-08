<script setup lang="ts">
import { ref } from 'vue';
import { authenticate, register } from '../helpers/user';
import { RouterLink } from 'vue-router';
import { store } from '../store';

const username = ref('')
const password = ref('')

async function login() {
    const user = await authenticate(username.value, password.value)
    store.login(user)
}

async function signup() {
    await register(username.value, password.value)
    login()
}

</script>
<template>
    <div class="right" v-if="!store.loggedInUser">
        <input type="text" placeholder="Username" v-model="username" />
        <input type="password" placeholder="Password" v-model="password" />
        <button class="nes-btn is-primary" @click="login">Log In</button>
        <button class="nes-btn" @click="signup">Sign Up</button>
    </div>
    <div v-else>
        <button class="nes-btn right" @click="store.logout">Log Out</button>
        <h3 class="center">Welcome, <RouterLink :to="'/profiles/' + store.loggedInUser.id">{{ store.loggedInUser.username }}</RouterLink></h3>
    </div>
</template>
<style scoped>
input {
    padding: 10px;
    margin: 5px;
}
</style>