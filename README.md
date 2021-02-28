# nodejs-backend-structure-modular-JS
## NodejS Backend structure modular JS
**Node JS Backend Application in Modular and structured way
This is a ready and production level tested structure worked with great perfomance and efficency.**

Table of content:
1. [The Idea](#the-idea)
2. [How it works.](#how-it-works)
3. [Requirement](#requirement)
4. [How to use.](#how-to-use)
5. [Vesrion History](#version-history)
6. [Author](#Author)
7. [License](#License)

## <a name="the-idea">The Idea</a>
  At the initial stage of thinking about the project, we mostly think how we gonna create a structure for our backend app,
basically there are few things which we most care about, being modular, and have well scalable structure for developing rest api, having a clean code and many more options based on our need.
so based in this **Idea** I came up with this solution to my self that I create some thing that is modular and ready to use without extra codes.
Simple to use without using extra modules and trying to have everything in the structre based on the map(soon I add photo of that map).



## <a name="how-it-works">How it works</a>
  We have Node.js Back-end application structure that produces REST API endpoints.  
  It's entry point is `index.js` file, the main modules that we uses are `Express` '`moongoose` and `redis`.
  we have our express app related codes and configurations inside `app.js` file and it exposes the app instance to `index.js`.  
  When you run the apllication first it tries to connect to MongoDB server.  
  Second it tries to connect to redis server.  
  And then finally it start the the app on configured port which default is set to `3000`.
  The application structred defined in a way the we have few folders with below structure.
  ```
  app  
    - modules
      -- module1
      -- module2
      -- ...  
    - services  
    - utils  
  ```
  **`Modules : `** contains modules folders, each folder inside this directory is treated as one module and it should has neccessary file structure that is required to load properly in the express app.  
  remember it's better to have each modules specified for one task.   
  Each module that we create is going to loadd automatically. no need to import anything anywher. 
  

  **`Servies : `**  contains the service files, Each service file is a class that has member specefied to do a specefic functionality, example `google-captcha`, `authentication`, `sendemail`, `logger`, `payment`, `sendgrid` or ...   

  **`Utils : `** this folder cotains some utilities files, working with string sor commong used functions & etc.  

  Each module is a folder and it usually has the following structure.
  ```
    userModule
      - route.js
      - controller.js
      - schema.js
  ```
  which existance of `route.js` is neccessary for each module, because `app.js` will look inside each module folder to load it and this is happening by loading the `route.js`.  
  `route.js` is a file that contains all the routes for that modules, exposes a function that create a new instance of the route class file.  



## <a name="requirement">Requirement</a>
Node.JS -> v12.18.2  
MongoDB -> tested with 4.2.8  
Redis Server  

## <a name="how-to-use">How to use.</a>
First get a copy or clone or download the project.  
In the root folder, copy `.env.sample` to `.env` file and modify the configuration based on your desire.  
**Configuration explaination will be added here soon**  
Then run `node index.js`  

## <a name="author">Author</a>
  [Ehsan Aghaei](https://github.com/ehsanagh)

## <a name="license">License</a>
 MIT License.
