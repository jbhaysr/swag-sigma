<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { User } from '../helpers/user';

type State = {
    userList: [User] | []
};

const state = reactive<State>({
    userList: []
});

const { dataSource, button } = defineProps<{
    dataSource: () => Promise<any>,
    button?: {
        text: string,
        action: (user: User) => void
    }
}>()

async function getData() {
    state.userList = (await dataSource()).result
}

const filteredList = computed(() => {
    return state.userList.filter(user => user.username.toLowerCase().includes(query.value.toLowerCase()))
})

const query = ref('')

function reset() {
    query.value = ''
}

getData()
</script>
<template>
    <div class="root">
        <input type="text" placeholder="Filter Users" v-model="query" />
        <button @click="reset">Reset</button>
        <br/>
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th v-if="button">{{ button.text }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in filteredList" :key="user.id">
                  <td><RouterLink :to="'/profiles/' + user.id">{{user.username}}</RouterLink></td>
                  <button v-if="button" @click="button.action(user)">{{ button.text }}</button>
                </tr>
            </tbody>
        </table>
    </div>
</template>