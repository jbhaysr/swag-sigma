<script setup lang="ts">
import { ref } from 'vue';
import { authenticate, register, User } from '../helpers/user';
import Cookies from 'js-cookie';

const loggedInUser = ref('')

const username = ref('')
const password = ref('')

function checkLoggedIn() {
    const userInfoCookie = Cookies.get('userInfo') || ''
    try {
        const user = JSON.parse(userInfoCookie) as User
        loggedInUser.value = user.username
    } catch (err) {
        loggedInUser.value = ''
    }
}
checkLoggedIn()

async function login() {
    Cookies.set('userInfo', JSON.stringify(await authenticate(username.value, password.value)))
    checkLoggedIn()
}

function signup() {
    register(username.value, password.value)
    login()
}

function logout() {
    Cookies.set('userInfo', '')
    checkLoggedIn()
}
</script>
<template>
    <div v-if="!loggedInUser">
        <input type="text" placeholder="Username" v-model="username" />
        <input type="password" placeholder="Password" v-model="password" />
        <button @click="login">Log In</button>
        <button @click="signup">Sign Up</button>
    </div>
    <div v-else>
        <h2>Welcome, {{ loggedInUser }}</h2>
        <button @click="logout">Log Out</button>
    </div>
</template>