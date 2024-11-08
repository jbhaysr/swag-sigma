<script setup lang="ts">
import FilteredUserList from './FilteredUserList.vue';
import { addFriend, getUsers, User } from '../helpers/user';
import { store } from '../store';

function addFriendCallback(user: User) {
  if(store.loggedInUser) {
    addFriend(store.loggedInUser, user)
  }
}

</script>
<template>
  <h3>User List</h3>
  <FilteredUserList :dataSource="getUsers" :button="{text: 'Add Friend', action: addFriendCallback}" />
</template>
