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
    <div v-if="!store.loggedInUser">
        <input type="text" placeholder="Username" v-model="username" />
        <input type="password" placeholder="Password" v-model="password" />
        <button @click="login">Log In</button>
        <button @click="signup">Sign Up</button>
    </div>
    <div v-else>
        <h2>Welcome, <RouterLink :to="'/profiles/' + store.loggedInUser.id">{{ store.loggedInUser.username }}</RouterLink></h2>
        <button @click="store.logout">Log Out</button>
    </div>
</template>