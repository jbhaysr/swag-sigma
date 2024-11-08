export const authenticate = async (username: string, password: string) => {
    return await fetch("https://swag-sigma.jbicks-haysr.workers.dev/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        credentials: 'include'
    }).then(async response => {
        return await response.json()
    })
    .catch(err => console.log(err))
}

export const register = async (username: string, password: string) => {
    return await fetch("https://swag-sigma.jbicks-haysr.workers.dev/users", {
        method: "POST",
        body: JSON.stringify({ username, password }),
    }).then(response => response.json())
    .catch(err => console.log(err))
}

export const getUsers = async () => {
    return await fetch("https://swag-sigma.jbicks-haysr.workers.dev/users", {
        method: "GET",
    }).then(response => response.json())
    .catch(err => console.log(err))
}

export const getUser = async (id: string) => {
    return await fetch("https://swag-sigma.jbicks-haysr.workers.dev/users/" + id, {
        method: "GET"
    }).then(response => response.json())
    .catch(err => console.log(err))
}

export const getFriends = async(id: string) => {
    return await fetch("https://swag-sigma.jbicks-haysr.workers.dev/users/" + id + "/friends", {
        method: "GET"
    }).then(response => response.json())
    .catch(err => console.log(err))
}

export const addFriend = async (user: User, friend: User) => {
    return await fetch("https://swag-sigma.jbicks-haysr.workers.dev/users/" + user.id + "/friends", {
        method: "POST",
        body: JSON.stringify({
            id: friend.id
        }),
        credentials: 'include'
    })
}

export const removeFriend = async (user: User, friend: User) => {
    return await fetch("https://swag-sigma.jbicks-haysr.workers.dev/users/" + user.id + "/friends/" + friend.id, {
        method: "DELETE",
        credentials: 'include'
    })
}

export const getStats = async () => {
    return await fetch("https://swag-sigma.jbicks-haysr.workers.dev/stats", {
        method: "GET"
    }).then(response => response.json())
    .catch(err => console.log(err))
}

export type User = {
    username: string,
    id: string
}
// export const userList = [
//     {
//         username: 'Steve',
//         id: '1',
//     },
//     {
//         username: 'Bill',
//         id: '2',
//     }
// ];