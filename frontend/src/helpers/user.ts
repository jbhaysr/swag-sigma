export const authenticate = async (username: string, password: string) => {
    return await fetch("https://swag-sigma.jbicks-haysr.workers.dev/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        credentials: 'include'
    }).then(response => response.json())
    .catch(err => console.log(err));
}

export const register = async (username: string, password: string) => {
    return await fetch("https://swag-sigma.jbicks-haysr.workers.dev/users", {
        method: "POST",
        body: JSON.stringify({ username, password }),
    }).then(response => response.json())
    .catch(err => console.log(err));
}

export const getUsers = async () => {
    return await fetch("https://swag-sigma.jbicks-haysr.workers.dev/users", {
        method: "GET",
    }).then(response => response.json())
    .catch(err => console.log(err));
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