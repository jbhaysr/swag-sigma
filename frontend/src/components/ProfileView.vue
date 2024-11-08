<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getFriends, getUser, removeFriend, User } from '../helpers/user';
import FilteredUserList from './FilteredUserList.vue';
import { store } from '../store';

const route = useRoute()
var userId = route.params.id as string

const refresh = ref(0)

var button: {
    text: string,
    action: (user: User) => void
} | undefined

const username = ref('')

async function getData() {
    userId = route.params.id as string
    if (userId === store.loggedInUser?.id) {
        button = {
            text: "Remove Friend",
            action: async (user) => {
                if(store.loggedInUser) {
                    await removeFriend(store.loggedInUser, user)
                    refresh.value++
                }
            }
        }
    } else { button = undefined }
    username.value = (await getUser(userId))[0].username
    refresh.value++
}

async function getFriendsList() {
    return await getFriends(userId)
}

watch(() => route.params.id, getData)
watch(() => store.loggedInUser?.id, getData)

getData()
</script>
<template>
    <h2>{{ username }}'s Friends:</h2>
    <FilteredUserList :key="refresh" :dataSource="getFriendsList" :button="button" />
</template>