# Super Wonderful Awesome Game - System for Integrated General Management of Acquaintances

I've been tasked with developing a full-stack JavaScript application for managing friends lists for a fictional "Super Wonderful Awesome Game".  The serverless stack for this project has been specified as Cloudflare Pages, Cloudflare Workers, Hono, and Neon.

## Deploying
To deploy:

* Go to your neon.tech dashboard and create a project
* Copy the connection string for the newly created project into .dev.vars:

```
# .dev.vars

DATABASE_URL="postgresql://user:pass@host/route?params"
```

* Run the following commands:

```bash
git clone https://github.com/jbhaysr/swag-sigma
cd swag-sigma
npm install
npm run db:migrate
npm run deploy
```

* Navigate to cloudflare.com -> Workers & Pages Overview ->'swag-sigma' project -> Integrations -> Neon -> Add Integration.
* Integrate your cloudflare.com project with the neon database you've just created.
* Your worker will automatically redeploy and your instance will be usable after DNS propagation.

## API specification
### `POST /users`

Body: `application/json`
```json
{
    "username": "string - The user's desired name."
}
```
Create a new user.

### `GET /users`

Retrieve a list of all users.

### `POST /users/:id/friends`

Body: `application/json`
```json
{
    "id": "UUID - The userId of the newly added friend."
}
```
Add a friend to a user's friend list.

### `DELETE /users/:id/friends/:friendId`
Remove a friend from a user's friend list.

### `GET /users/:id/friends`
Retrieve a list of all friends for a given user.
