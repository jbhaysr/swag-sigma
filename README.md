# Super Wonderful Awesome Game - System for Integrated General Management of Acquaintances

I've been tasked with developing a basic backend JavaScript application for managing a friends list for a fictional "Super Wonderful Awesome Game".


## API specification
`POST /users`
Body: `application/json`
```json
{
    "username": string - The user's desired name.
}````
Create a new user.

`GET /users`
Retrieve a list of all users.

`POST /users/:id/friends`
Body: `application/json`
```json
{
    "id": UUID - The userId of the newly added friend.
}```
Add a friend to a user's friend list.

`DELETE /users/:id/friends/:friendId`
Remove a friend from a user's friend list.

`GET /users/:id/friends`
Retrieve a list of all friends for a given user.

## Deployment
This project was deployed with:
* A neon.tech account
* A cloudflare.com account
* node v20.18.0
* npm v10.8.2

To deploy:

* Go to your neon.tech dashboard and create a project
* Copy the connection string into .dev.vars:

```
# .dev.vars

DATABASE_URL="postgresql://user:pass@host/route?params"
```

```bash
git clone https://github.com/jbhaysr/swag-sigma
cd swag-sigma
npm install
npm run db:migrate
npm run deploy
```

* Authenticate to cloudflare.com if necessary.
* Select a workers.dev subdomain to which to deploy the oject.
* Go to your cloudflare.com dashboard and select your Workers & Pages Overview.
* Select the 'swag-sigma' project -> Integrations -> Neon -> Add Integration.
* Integrate your cloudflare.com project with the neon database you've just created.
* Your worker will automatically redeploy and your instance will be usable once any lingering DNS propagates.