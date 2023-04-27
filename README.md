# Archetype NEMBBMS

# NodeJS ExpressJS MongoDB Boilerplate Backend Modular Structure - pure JS

[![made-with-javascript](http://ForTheBadge.com/images/badges/made-with-javascript.svg)](https://www.javascript.com/)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/ehsanagh/nodejs-backend-structure-modular-JS/graphs/commit-activity)
[![Generic badge](https://img.shields.io/badge/Author-Ethan-<COLOR>.svg)](https://www.linkedin.com/in/ehsanaghaei/)

## NodejS Backend structure modular JS

**Node JS Backend Application with Modular code structured**

This is a ready and production level tested structure worked with great perfomance and efficency.

Table of content:

1. [The Idea](#the-idea)
2. [How it works](#how-it-works)
3. [Requirement](#requirement)
4. [How to run](#how-to-use)
5. [modules](#modules)
6. [services](#services)
7. [Author](#Author)
8. [License](#License)

## <a name="the-idea">The Idea</a>

Our main objective is to establish a strong structure for the backend application using Express.js. Our top priorities include a modular and decoupled code structure, a scalable approach for REST API development, and following best practices for writing clean code and implementation.

Additionally, as many common business logics and functionalities are repetitive, we have made the decision to implement each of these scenarios only once to save time and effort in the long run.

## <a name="how-it-works">How it works</a>

Here we have a Node.js Backend application that produces REST API endpoints.  
 It's entry point is `index.js` file, the main modules that we uses are `Express` ' `moongoose`.
we have our express app related codes and configurations inside `app.js` file and it exposes the app instance to `index.js`.  
 When you run the apllication first it tries to connect to MongoDB server.  
 And then finally it start the the app on configured port which is configured inside `.env` configuration file.

The application code structure is as below:

```
app
  - common
  - modules
    -- module1
    -- module2
    -- ...
  - services
```

**`Common` :** here is the place that we keep out commonly used codes and tools like, FactorClasses. Global Validators, Loggers and ...

**`Modules` :** contains modules folders, each folder inside this directory is treated as one module and it should has neccessary file structure that is required to load properly in the express app.  
 remember it's better to have each modules specified for one task.  
 Each module that we create is going to loadd automatically. no need to import anything anywher.

**`Servies` :** contains the service files, Each service file is a class that has member specefied to do a specefic functionality, example `google-captcha`, `authentication`, `sendemail`, `logger`, `payment`, `sendgrid` or ...

Each module is a folder and it usually has the following structure.

```
  user
    - controller.js
    - route.js
    - schema.js
    - [*].yaml
    - validator.js
```

`controller.js` is where the business logic resides, all of our logical operations will be handled inside controller.<br />
which existance of `route.js` is neccessary for each module, because autoloader will look inside each module folder to load `route.js` which is the entry point for each module. <br/>
`route.js` is a file that contains all the routes for that modules, exposes a function that create a new instance of the route class file. <br />
`schema.js` is the file that contains our mongoose Schema files for MongoDB. <br />
`*.yaml` any file with `.yaml` format inside module directory is an OpenAPI speceficiation for the rest APIs which will be used by Swagger-UI. <br />
`validator.js` all of the API validation for the module are defined here by using express-validator

`sample-module` folder is a example module which you can use as template, it's tiny and doesn't contain any logic.

## <a name="requirement">Requirement</a>

Node.JS -> v16.15.1
MongoDB -> tested with > 4.2.8

## <a name="how-to-use">How to Run</a>

First get a copy or clone or download the project.  
In the root folder, copy `.env.sample` to `.env` file and modify the configuration based on your desire.

---

Configuration Options

`PORT` : the application port

`MONGO_URI` : MongoDB connection string <br />
the dault value is set to point to the local docker MongoDB container <br />

**_Run Local Docker MongoDB Containe_** <br/>

first make sure have the `docker` engine installed and runing on your machine <br />
`npm run db:up` : brings up the MongoDB container <br />
`npm run db:down` : stops the Mongodb container <br />
`npm run db:purge` : removes the container <br />

`DBNAME` : set your MongoDB databse name here

`VERIFICATION_CODE_LIFE_TIME` : time to expire of the user verification code in minutes since it get generated, used in `user` module

`RESEND_VC_LIFE_TIME` : verification code resend cool-off time in minute, default is 2, means only one verification code can be generated in every 2 minute, used in `user` modules

`JWT_SECRET` : JSON Web Token Secret signing key, makesure to change this

---

Install the dependecies by `npm i` or `yarn` command

Then run `npm run start` Or `yarn start` to start the application <br />
API documentation is available by Swagger under `http://[host]:[port]/docs`

## <a name="modules">Modules</a>

... updating...

## <a name="services">Services</a>

... updating...

---

### <a name="author">Author</a>

[Ehsan Aghaei](https://github.com/ethyaan)

### <a name="license">License</a>

MIT License.
