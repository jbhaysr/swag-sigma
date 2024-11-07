<script setup>
    import { computed, reactive, ref } from 'vue';
    import { getUsers } from '../helpers/user';

    const state = reactive({
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