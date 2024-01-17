import { rest } from 'msw'

const mockDB = [{_id: 1, username: "TUser1", password: "TPassword1!", 
                  tasks: [{title: "mock1", description: "fake response 1", _id: 1},
                          {title: "mock2", description: "fake response 2", _id: 2},
                          {title: "mock3", description: "fake response 3", _id: 3}],
                  collections: [{collectionTitle: "mockCollection1",
                                collectionDescription: "fake collection response 1",
                                collectionStatus: "Incomplete", _id: 1, tasks: []},
                                {collectionTitle: "mockCollection2",
                                collectionDescription: "fake collection response 2",
                                collectionStatus: "Incomplete", _id: 2, tasks: []}]
                },
                {_id: 2, username: "TUser2", password: "TPassword2!", 
                  tasks: [{title: "mock1", description: "fake response 1", _id: 1},
                          {title: "mock2", description: "fake response 2", _id: 2},
                          {title: "mock3", description: "fake response 3", _id: 3}],
                  collections: [{collectionTitle: "mockCollection1",
                                collectionDescription: "fake collection response 1",
                                collectionStatus: "Incomplete", _id: 1, tasks: []}]
                },
                {_id: 3, username: "TUser3", password: "TPassword3!", tasks: [], collections: []},
                {_id: 4, username: "TUser4", password: "TPassword4!", 
                tasks: [{title: "mock1", description: "fake response 1", _id: 1},
                        {title: "mock2", description: "fake response 2", _id: 2},
                        {title: "mock3", description: "fake response 3", _id: 3}],
                collections: [{collectionTitle: "mockCollection1 user4",
                              collectionDescription: "fake collection response 1",
                              collectionStatus: "Incomplete", _id: 1, tasks: []},
                              {collectionTitle: "mockCollection2 user4",
                              collectionDescription: "fake collection response 2",
                              collectionStatus: "Incomplete", _id: 2, tasks: []}]
              },]

export const handlers = [
  // -------------------------------------- Home Page Handlers --------------------------------------------------------
    rest.get('http://localhost:8080/fetchTasks/:userID', (req, res, ctx) => {
        const userCheck = parseInt(req.params.userID)

        const index = mockDB.filter((user) => user._id === userCheck)
        if(index[0].user_id == 0)
         return res(ctx.status(400))
        else{
          return res(ctx.json(index[0].tasks))
        }
      }),
    rest.post('http://localhost:8080/addTask', async (req, res, ctx) => {
        const data = await req.json()
        const userCheck = data.userID;
        const userIndex = mockDB.filter((user) => user._id === userCheck)
        if(userIndex[0].user_id == 0)
         return res(ctx.status(400))
        else{
        let nextId = 0;
        let lastTask = [];
        try{
        const dbTask = userIndex[0]
        let localCopy = JSON.parse(JSON.stringify(dbTask))
        if(localCopy.tasks)
            lastTask = localCopy.tasks.pop();
        if(lastTask.length !== 0)
            nextId = lastTask._id + 1;}
        catch(error){}
        const newTask = {title: data.title, description: data.desc, status: data.status, _id: nextId}
        const index = mockDB.filter((user) => user._id === userCheck)
        if(index[0].user_id == 0)
         return res(ctx.status(400))
        else{
          index[0].tasks.push(newTask)
          return res(ctx.json(index[0].tasks))
        }}
      }),
      rest.delete('http://localhost:8080/tasks/:taskId', async (req, res, ctx) => {
        const taskNumber = parseInt(req.params.taskId)
        const data = await req.json()
        const userCheck = data.userID;
        const userIndex = mockDB.filter((user) => user._id === userCheck)
        if(userIndex[0].user_id == 0)
         return res(ctx.status(400))
        else{
          console.log(userIndex[0].tasks)
          const deleteTask = userIndex[0].tasks.filter((task) => task._id != taskNumber)
          return res(ctx.json(deleteTask))
        }
      }),
      rest.post('http://localhost:8080/updateTaskInfo', async (req, res, ctx) => {
        const data = await req.json()
        const userCheck = data.userID;
        const taskNumber = data.taskID
        const userIndex = mockDB.filter((user) => user._id === userCheck)
        if(userIndex[0].user_id == 0)
         return res(ctx.status(400))
        else{
          const taskIndex = userIndex[0].tasks.findIndex((task) => task._id == taskNumber)
          userIndex[0].tasks[taskIndex].title = data.newTitle
          userIndex[0].tasks[taskIndex].description = data.newDesc
          return res(ctx.json(userIndex[0].tasks))
        }
      }),
  // -------------------------------------- Login Page Handlers --------------------------------------------------------
      rest.post('http://localhost:8080/addUser', async (req, res, ctx) => {
        const data = await req.json()
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*?[0-9])(?=.*\W).{8,24}$/;
        if(passwordRegex.test(data.newPassword)){
          let nextId = 1;
          let lastUser = [];
          try{
          const dbUser = mockDB
          let localCopy = JSON.parse(JSON.stringify(dbUser))
          if(localCopy)
            lastUser = localCopy.pop();
          if(lastUser.length !== 0)
              nextId = lastUser._id + 1;
          const newUser = {_id: nextId, username: data.newUsername, password: data.newPassword, tasks: [], collections: []}
          mockDB.push(newUser)
          return res(ctx.json(newUser))
        } catch (error) {}
      } else
          return res(ctx.json("Cant add user"), ctx.status(400))
    }),

    rest.post('http://localhost:8080/userLogin', async (req, res, ctx) => {
      const data = await req.json()
      const username = data.username;
      const check = data.pswrd
      const index = mockDB.filter((user) => user.username === username)
      if(index.password == check){
        return res(ctx.json(index[0]))
      } else
        return res(ctx.json("Incorrect username or password"), ctx.status(400))
    }),
  // -------------------------------------- Collection Page Handlers ----------------------------------------------------
    rest.get('http://localhost:8080/collections/:userID', (req, res, ctx) => {
      const userCheck = parseInt(req.params.userID)

      const index = mockDB.filter((user) => user._id === userCheck)
      if(index[0].user_id == 0)
       return res(ctx.status(400))
      else{
        return res(ctx.json(index[0].collections))
      }
    }),
    rest.post('http://localhost:8080/collections/create', async (req, res, ctx) => {
      const data = await req.json()
      const userCheck = data.userID;
      const userIndex = mockDB.filter((user) => user._id === userCheck)
      if(userIndex[0].user_id == 0)
       return res(ctx.status(400))
      else{
        let nextId = 0;
        let lastCollection = [];
        try{
        const dbCollection = userIndex[0]
        let localCopy = JSON.parse(JSON.stringify(dbCollection))
        if(localCopy.collections)
            lastCollection = localCopy.collections.pop();
        if(lastCollection.length !== 0)
            nextId = lastCollection._id + 1;}
        catch(error){}
        const newCollection = {collectionTitle: data.title, collectionDescription: data.desc, 
          collectionStatus: data.status, _id: nextId, tasks: []}
        const index = mockDB.filter((user) => user._id === userCheck)
        if(index[0].user_id == 0)
        return res(ctx.status(400))
        else{
          index[0].collections.push(newCollection)
          return res(ctx.json(index[0].collections))
        }}
    }),
    rest.delete('http://localhost:8080/collections/delete/:collectionID', async (req, res, ctx) => {
      const collectionNumber = parseInt(req.params.collectionID)
      const data = await req.json()
      const userCheck = data.userID;
      const userIndex = mockDB.filter((user) => user._id === userCheck)
      if(userIndex[0].user_id == 0)
       return res(ctx.status(400))
      else{
        const deleteTask = userIndex[0].collections.filter((collection) => collection._id != collectionNumber)
        return res(ctx.json(deleteTask))
      }
    }),
    rest.post('http://localhost:8080/collections/update', async (req, res, ctx) => {
      const data = await req.json()
      const userCheck = data.userID;
      const collectionNumber = data.collectionID
      const userIndex = mockDB.filter((user) => user._id === userCheck)
      if(userIndex[0].user_id == 0)
       return res(ctx.status(400))
      else{
        const collectionIndex = userIndex[0].collections.findIndex((collection) => collection._id == collectionNumber)
        console.log(userIndex[0].collections[collectionIndex])
        userIndex[0].collections[collectionIndex].collectionTitle = data.newTitle
        userIndex[0].collections[collectionIndex].collectionDescription = data.newDesc
        return res(ctx.json(userIndex[0].collections))
      }
    }),
    // -------------------------------------- Collection Tasks Page Handlers ----------------------------------------------------
    rest.get('http://localhost:8080/collections/:collectionID', (req, res, ctx) => {
      const userCheck = parseInt(req.params.userID)

      const index = mockDB.filter((user) => user._id === userCheck)
      if(index[0].user_id == 0)
       return res(ctx.status(400))
      else{
        return res(ctx.json(index[0].collections))
      }
    }),
    rest.post('http://localhost:8080/collections/tasks/create', async (req, res, ctx) => {
      const data = await req.json()
      const userCheck = data.userID;
      const collectionCheck = data.collectionID;
      const userIndex = mockDB.filter((user) => user._id === userCheck)
      if(userIndex[0].user_id == 0)
       return res(ctx.status(400))
      else{
        const colIndex = userIndex[0].collections.findIndex((collection) => collection._id === collectionCheck)
        let nextId = 1;
        let lastTask = [];
        try{
        const dbCollection = userIndex[0].collections[colIndex]
        let localCopy = JSON.parse(JSON.stringify(dbCollection))
        if(localCopy.tasks)
            lastTask = localCopy.tasks.pop();
        if(lastTask.length !== 0)
            nextId = lastTask._id + 1;}
        catch(error){}
        const newTask = {title: data.title, description: data.desc, 
          status: data.status, _id: nextId}

          userIndex[0].collections[colIndex].tasks.push(newTask)
          return res(ctx.json(userIndex[0].collections[colIndex]))
        }
    }),
    rest.delete('http://localhost:8080/collections/delete/:collectionID/:taskID', async (req, res, ctx) => {
      const collectionNumber = parseInt(req.params.collectionID)
      const taskNumber = parseInt(req.params.taskID)
      const data = await req.json()
      const userCheck = data.userID;
      const userIndex = mockDB.filter((user) => user._id === userCheck)
      if(userIndex[0].user_id == 0)
       return res(ctx.status(400))
      else{
        const colIndex = userIndex[0].collections.findIndex((collection) => collection._id === collectionNumber)
        const deleteTask = userIndex[0].collections[colIndex].tasks.filter((task) => task._id != taskNumber)
        return res(ctx.json(deleteTask))
      }
    }),
]