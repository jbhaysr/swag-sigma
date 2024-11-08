<script setup lang="ts">
import FilteredUserList from './FilteredUserList.vue';
import { addFriend, getFriends, getUsers, User } from '../helpers/user';
import { store, UserTableButton } from '../store';
import { ref, watch } from 'vue';

const refresh = ref(0)

async function addFriendCallback(user: User) {
  if(store.loggedInUser) {
    await addFriend(store.loggedInUser, user)
    getData()
  }
}

var button: UserTableButton
var friendsList: [User]

async function getData() {
    if (store.loggedInUser) {
        friendsList = (await getFriends(store.loggedInUser.id)).result
        button = {
            text: "Add Friend",
            action: addFriendCallback,
            shouldDisplay: (user) => {
              if (user.id === store.loggedInUser?.id) {
                return false
              }
              if (friendsList.some((friend) => friend.id === user.id)) {
                return false
              }
              return true
            }
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
