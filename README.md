# Archetype NEMBBMS

# NodeJS ExpressJS MongoDB Boilerplate Backend Modular Structure - pure JS

[![forthebadge made-with-javascript](http://ForTheBadge.com/images/badges/made-with-javascript.svg)](https://www.javascript.com/)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/ehsanagh/nodejs-backend-structure-modular-JS/graphs/commit-activity)
[![Generic badge](https://img.shields.io/badge/Author-EhsanAghaei-<COLOR>.svg)](mailto:ehsan.aghaeii@gmail.com)

## NodejS Backend structure modular JS

**Node JS Backend Application with Modular code structured**

This is a ready and production level tested structure worked with great perfomance and efficency.

Table of content:

1. [The Idea](#the-idea)
2. [How it works.](#how-it-works)
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

**`Common : `** here is the place that we keep out commonly used codes and tools like, FactorClasses. Global Validators, Loggers and ...

**`Modules : `** contains modules folders, each folder inside this directory is treated as one module and it should has neccessary file structure that is required to load properly in the express app.  
 remember it's better to have each modules specified for one task.  
 Each module that we create is going to loadd automatically. no need to import anything anywher.

**`Servies : `** contains the service files, Each service file is a class that has member specefied to do a specefic functionality, example `google-captcha`, `authentication`, `sendemail`, `logger`, `payment`, `sendgrid` or ...

Each module is a folder and it usually has the following structure.

```
  user
    - route.js
    - controller.js
    - schema.js
```

which existance of `route.js` is neccessary for each module, because `app.js` will look inside each module folder to load it and this is happening by loading the `route.js`.  
 `route.js` is a file that contains all the routes for that modules, exposes a function that create a new instance of the route class file.

## <a name="requirement">Requirement</a>

Node.JS -> v16.15.1
MongoDB -> tested with > 4.2.8

## <a name="how-to-use">How to Run</a>

First get a copy or clone or download the project.  
In the root folder, copy `.env.sample` to `.env` file and modify the configuration based on your desire.

**Configuration explaination will be added here soon**
Then run `node index.js`

## <a name="modules">Modules</a>

... updating...

## <a name="services">Services</a>

... updating...

----

### <a name="author">Author</a>

[Ehsan Aghaei](https://github.com/ethyaan)

### <a name="license">License</a>

MIT License.
