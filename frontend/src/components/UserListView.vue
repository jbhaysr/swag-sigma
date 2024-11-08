<script setup lang="ts">
import FilteredUserList from './FilteredUserList.vue';
import { addFriend, getUsers, User } from '../helpers/user';
import { store } from '../store';
import { ref, watch } from 'vue';

const refresh = ref(0)

function addFriendCallback(user: User) {
  if(store.loggedInUser) {
    addFriend(store.loggedInUser, user)
  }
}

var button: {
    text: string,
    action: (user: User) => void
} | undefined

async function getData() {
    if (store.loggedInUser) {
        button = {
            text: "Add Friend",
            action: addFriendCallback
        }
    } else { button = undefined }
    refresh.value++
}

watch(() => store.loggedInUser?.id, getData)

getData()
</script>
<template>
  <h3 class="center">User List</h3>
  <FilteredUserList class="center" :key="refresh" :dataSource="getUsers" :button="button" />
</template>
