<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getFriends, getUser, removeFriend } from '../helpers/user';
import FilteredUserList from './FilteredUserList.vue';
import { store, UserTableButton } from '../store';

const route = useRoute()
var userId = route.params.id as string

const refresh = ref(0)

var button: UserTableButton

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
            },
            shouldDisplay: () => true,
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
    <h2 class="center">{{ username }}'s Friends:</h2>
    <FilteredUserList class="center" :key="refresh" :dataSource="getFriendsList" :button="button" />
</template>