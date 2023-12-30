# TaskPlanner
A project to keep track of tasks. (Work in progress)
Created using MongoDB, Express.js, React.js, and Node.js

## Project Setup
There are two ways of running the application: Locally and using a MongoDB Database.
Both of these require installing dependencies after cloning by using

```
npm i
```

# Using local storage
After installing dependencies access the client folder and simply run

```
npm run dev
```

The application should work normally but some functions that require the database
such as creating an account, logging in, and creating groups will not be functional.

# Using a MongoDB Database
After installing dependencies access the client and server folder.

In the server folder:

1. Create a .env file following example.env file (will require your database link)
2. Travel to the server/src folder and run `node server.js`
3. The API should be ready for use now

In the client folder:

1. Create a .env file following example.env file
2. Run the `npm run dev`

The application should be setup after completing both sections and the website should be ready for use