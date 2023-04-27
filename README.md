# Real-Time-Inventory-Management-System
A  RESTful web service that can manage a real-time inventory system. The application should be able to perform basic CRUD operations on the inventory and allow real-time updates to all connected clients via websockets.


## Instructions: 
    1. Create a Node.js/Express.js project that implements a RESTful API for inventory management. The API should support the following endpoints: 
        a. GET /inventory - Retrieve the entire inventory 
        b. GET /inventory/:id - Retrieve a single item from the inventory 
        c. POST /inventory - Add a new item to the inventory 
        d. PUT /inventory/:id - Update an existing item in the inventory 
        e. DELETE /inventory/:id - Remove an item from the inventory. 
    
    2. The inventory data should be stored in a database (SQL or NoSQL, your choice). 
    
    3. Implement WebSockets using Socket.IO to allow real-time updates to all connected clients. 
       Whenever an item is added, updated, or removed from the inventory, a message should be broadcasted to all connected clients to reflect the change in the inventory. 
       
    4. Add an optional front-end interface for displaying the inventory in real time. 


## Steps to run the project:
    Step-1: Go inside "server" Directory/Folder.
    Step-2: Install all dependencies i.e. execute command - "npm i". 
    Step-3: Execute command - "npm start". 
    Step-4: Go to URL - "http://localhost:3000/" on the browser.
