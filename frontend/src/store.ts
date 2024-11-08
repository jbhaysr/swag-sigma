import { reactive } from "vue";
import Cookies from "js-cookie";
import { User } from "./helpers/user";

function getLoggedInUser (): User | undefined {
    return JSON.parse(Cookies.get('userInfo') || '')
}

export const store = reactive({
    loggedInUser: getLoggedInUser(),
    login(user: User) {
        this.loggedInUser = user
    },
    logout() {
        this.loggedInUser = undefined
    }
})