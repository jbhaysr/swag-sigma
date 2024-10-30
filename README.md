# Super Wonderful Awesome Game - System for Integrated General Management of Acquaintances

I've been tasked with developing a full-stack JavaScript application for managing friends lists for a fictional "Super Wonderful Awesome Game".  The serverless stack for this project has been specified as Cloudflare Pages, Cloudflare Workers, Hono, and Neon.

## Deploying
To deploy:

1. Clone the repository and generate a JWT secret:

```bash
git clone https://github.com/jbhaysr/swag-sigma
cd swag-sigma
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

2. Go to your neon.tech dashboard and create a project
3. Copy the connection string for the newly created project into .dev.vars:

```
# .dev.vars

DATABASE_URL="postgresql://user:pass@host/route?params"
```

4. Install dependencies and migrate your database:

```bash
npm install
npm run db:migrate
npm run deploy
```

5. Navigate to cloudflare.com -> Workers & Pages Overview ->'swag-sigma' project -> Integrations -> Neon -> Add Integration.
6. Integrate your cloudflare.com project with the neon database you've just created.
7. Under this same project, navigate to Settings -> Variables and Secrets -> Add
8. Name the variable "JWT_SECRET_KEY" and paste the token you generated in step 1.  Encrypt and deploy.
9. Your worker will automatically redeploy and your instance will be usable after DNS propagation.

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
