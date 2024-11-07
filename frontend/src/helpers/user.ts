export const getUsers = async () => {
    return await fetch("https://swag-sigma.jbicks-haysr.workers.dev/users", {
        method: "GET",
    }).then(response => response.json())
    .catch(err => console.log(err));
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