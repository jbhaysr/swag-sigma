import { createWebHistory, createRouter } from "vue-router";
import UserList from "./components/UserListView.vue";
import ProfileView from "./components/ProfileView.vue";

const routes = [
    { path: '/profiles/:id', component: ProfileView },
    { path: '/', component: UserList },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router