import { reactive } from "vue";
import Cookies from "js-cookie";
import { User } from "./helpers/user";

function getLoggedInUser (): User | undefined {
    try {
        return JSON.parse(Cookies.get('userInfo') || '')
    } catch (err) {
        return undefined
    }
}

export const store = reactive({
    loggedInUser: getLoggedInUser(),
    login(user: User) {
        this.loggedInUser = user
        Cookies.set('userInfo', JSON.stringify(user))
    },
    logout() {
        this.loggedInUser = undefined
        Cookies.remove('userInfo')
    }
})

export type UserTableButton = {
    text: string,
    action: (user: User) => void,
    shouldDisplay: (user: User) => boolean,
} | undefined