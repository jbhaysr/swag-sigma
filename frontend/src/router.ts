import { createMemoryHistory, createRouter } from "vue-router";
import UserList from "./components/UserList.vue";

const routes = [
    { path: '/', component: UserList },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router