<script setup lang="ts">
    import { computed, reactive } from 'vue';
    import { getUsers, User } from '../helpers/user';

    type State = {
        userList: [User] | []
    };

    const state: State = reactive({
        userList: []
    });
    
    const { query } = defineProps(['query'])

    async function getData() {
        state.userList = (await getUsers()).result
    }

    const filteredList = computed(() => {
        return state.userList.filter(user => user.username.toLowerCase().includes(query.toLowerCase()))
    })

    getData()
</script>
<template>
    <div class="root">
        <ul>
            <li v-for="user in filteredList" :key="user.id">
              {{user.username}}
            </li>
        </ul>
    </div>
</template>