import { rest } from 'msw'

  // Mock User Database
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

  // Mock User DB with Groups
  const mockDBGroups = [{_id: 1, username: "TUser1", password: "TPassword1!", tasks: [], collections: [],
    groups: {invites: [], joined: {groupTitle: "mockGroup1", groupDescription: "fake group response 1", groupStatus: "Incomplete", _id: 1, tasks: []}}},
    {_id: 2, username: "TUser2", password: "TPassword2!", tasks: [], collections: [], groups: {invites: [], joined: []}},
    {_id: 3, username: "TUser3", password: "TPassword3!", tasks: [], collections: [], groups: {invites: ["testInvite", "testInvite2"], joined: []}},
    {_id: 4, username: "TUser4", password: "TPassword4!", 
      tasks: [{title: "mock1", description: "fake response 1", _id: 1}, {title: "mock2", description: "fake response 2", _id: 2},
        {title: "mock3", description: "fake response 3", _id: 3}],
      collections: [{collectionTitle: "mockCollection1 user4", collectionDescription: "fake collection response 1",
        collectionStatus: "Incomplete", _id: 1, tasks: []},
        {collectionTitle: "mockCollection2 user4", collectionDescription: "fake collection response 2", collectionStatus: "Incomplete", _id: 2, tasks: []}],
        groups: {invites: ["testInvite", "testInvite2"], joined: [{groupTitle: "mockGroup1", groupDescription: "fake group response 1", 
          groupStatus: "Incomplete", _id: 1, collections: [], permissions: "Admin"}]}
    }]

    // Mock Group DB
    const mockGroup = [{groupName: "TestGroup1", groupDescription: "Test Group 1", groupStatus: "Incomplete", _id: 1, groupAdmin: ["TUser1"],
      groupMembers: ["TUser2"], collections: []},
    {groupName: "TestGroup2", groupDescription: "Test Group 2", groupStatus: "Incomplete", _id: 2, groupAdmin: ["TUser2"], 
      groupMembers: ["TUser1", "TUser3"], collections: []},]

    // Mock Group DB with Tasks
    const mockGroupTasks = [
    {groupName: "TestGroup1", groupDescription: "Test Group 1", groupStatus: "Incomplete", _id: 1, groupAdmin: ["TUser1"],
      groupMembers: ["TUser2"], collections: [{collectionTitle: "mockCollection1 group1", collectionDescription: "fake collection response 1",
      collectionStatus: "Incomplete", _id: 1, tasks: []}]},
    {groupName: "TestGroup2", groupDescription: "Test Group 2", groupStatus: "Incomplete", 
      _id: 2, groupAdmin: ["TUser2"], groupMembers: ["TUser1", "TUser3"], collections: [{collectionTitle: "mockCollection1 group2", 
      collectionDescription: "fake collection response 2", collectionStatus: "Incomplete", _id: 1, tasks: [{_id: 1, title: "Task1", description: "Fake Task 1", 
      status: "Incomplete"}]}]},]

export const handlers = [

  // ------------------------------------------------------------------------------------------------------------------
  // -------------------------------------- Home Page Handlers --------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------------------

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

  // -------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------
  // -------------------------------------- Login Page Handlers --------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------

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

  // --------------------------------------------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------------------------------------
  // -------------------------------------- Collection Page Handlers ----------------------------------------------------
  // --------------------------------------------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------------------------------------

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
        userIndex[0].collections[collectionIndex].collectionTitle = data.newTitle
        userIndex[0].collections[collectionIndex].collectionDescription = data.newDesc
        return res(ctx.json(userIndex[0].collections))
      }
    }),

    // --------------------------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------------------------
    // -------------------------------------- Collection Tasks Page Handlers ----------------------------------------------------
    // --------------------------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------------------------

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
    rest.post('http://localhost:8080/collections/tasks/update', async (req, res, ctx) => {
      const data = await req.json()
      const userCheck = data.userID;
      const collectionNumber = data.collectionID
      const taskNumber = data.taskID
      const userIndex = mockDB.filter((user) => user._id === userCheck)
      if(userIndex[0].user_id == 0)
       return res(ctx.status(400))
      else{
        const collectionIndex = userIndex[0].collections.findIndex((collection) => collection._id == collectionNumber)
        const taskIndex = userIndex[0].collections[collectionIndex].tasks.findIndex((task) => task._id == taskNumber)
        userIndex[0].collections[collectionIndex].tasks[taskIndex].title = data.newTitle
        userIndex[0].collections[collectionIndex].tasks[taskIndex].description = data.newDesc
        return res(ctx.json(userIndex[0].collections[collectionIndex].tasks))
      }
    }),

    // ----------------------------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------------------------
    // -------------------------------------- Groups Page Handlers ----------------------------------------------------
    // ----------------------------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------------------------

    rest.post('http://localhost:8080/groups/createGroup', async (req, res, ctx) => {
      const data = await req.json()
      const userCheck = data.userID;
      const userIndex = mockDBGroups.filter((user) => user._id === userCheck)
      if(userIndex[0].user_id == 0)
       return res(ctx.status(400))
      else{
        let nextId = 1;
        let lastGroup = [];
        try{
        const dbCollection = userIndex[0].groups.joined
        let localCopy = JSON.parse(JSON.stringify(dbCollection))
        if(localCopy)
            lastGroup = localCopy.pop();
        if(lastGroup.length !== 0)
            nextId = lastGroup._id + 1;}
        catch(error){}
          const newGroup = {groupName: data.title, groupDescription: data.desc, 
            collections: [], _id: nextId, permissions: "Admin"}
          userIndex[0].groups.joined.push(newGroup)
          return res(ctx.json(userIndex[0]))
        }
    }),
    rest.post('http://localhost:8080/groups/:groupID/invite/action', async (req, res, ctx) => {
      const data = await req.json()
      const userCheck = data.userID;
      const inviteCheck = req.params.groupID;
      const action = data.action;
      const userIndex = mockDBGroups.filter((user) => user._id === userCheck)
      if(userIndex[0].user_id == 0)
       return res(ctx.status(400))
      else{
        const inviteIndex = userIndex[0].groups.invites.findIndex((invite) => invite === inviteCheck)
        if(action === "accept"){

          const mockInviteGroup = {
            groupTitle: inviteCheck, 
            groupDescription: "Fake invite group", 
            groupStatus: "Incomplete", 
            _id: 10,
            collections: [],
            permissions: "Member"
          }

          userIndex[0].groups.joined.push(mockInviteGroup)
          userIndex[0].groups.invites.splice(inviteIndex, 1)
          return res(ctx.json(userIndex[0].groups))
        } else if(action === "deny"){
          userIndex[0].groups.invites.splice(inviteIndex, 1)
          return res(ctx.json(userIndex[0].groups))
        }
      }
    }),

    // ---------------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------------
    // -------------------------------------- Group Page Handlers ----------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------------

    rest.post('http://localhost:8080/groups/:groupID/updateGroup', async (req, res, ctx) => {
      const data = await req.json()
      const userCheck = data.userID;
      const groupCheck = parseInt(req.params.groupID)
      const userIndex = mockDBGroups.filter((user) => user._id === userCheck)
      if(userIndex[0].user_id == 0)
       return res(ctx.status(400))
      else{
        const groupIndex = userIndex[0].groups.joined.findIndex((group) => group._id === groupCheck)
        userIndex[0].groups.joined[groupIndex].groupName = data.groupName
        userIndex[0].groups.joined[groupIndex].groupDescription = data.groupDescription
        return res(ctx.json(userIndex[0].groups))
      }
    }),

    rest.delete('http://localhost:8080/groups/:groupID/leaveGroup/:userID', async (req, res, ctx) => {
      const groupCheck = parseInt(req.params.groupID)
      const userCheck = parseInt(req.params.userID)
      const userIndex = mockDBGroups.filter((user) => user._id === userCheck)
      const groupIndex = mockGroup.findIndex((group) => group._id === groupCheck)
      if(userIndex[0].user_id == 0)
       return res(ctx.status(400))
      else{
        if(mockGroup[groupIndex].groupMembers.includes(userIndex[0].username)){
          const leaveGroup = mockGroup[groupIndex].groupMembers.filter((member) => member != userIndex[0].username)
          return res(ctx.json(leaveGroup))
        } else
          return res(ctx.status(400), ctx.json("You are not a member of this group"))
      }
    }),

    rest.post('http://localhost:8080/groups/:groupID/invite', async (req, res, ctx) => {
      const data = await req.json()
      const userCheck = data.userID;
      const groupCheck = parseInt(req.params.groupID)
      const userIndex = mockDBGroups.filter((user) => user._id === userCheck)
      if(userIndex[0].user_id == 0)
       return res(ctx.status(400))
      else{
        const groupIndex = mockGroup.findIndex((group) => group._id === groupCheck)
        if(mockGroup[groupIndex].groupAdmin.includes(userIndex[0].username) || mockGroup[groupIndex].groupMembers.includes(userIndex[0].username)){
          const inviteUser = mockDBGroups.filter((user) => user.username === data.invUsername)
          if(inviteUser.length === 0){
            return res(ctx.status(400), ctx.json("User does not exist"))
          } else{
            inviteUser[0].groups.invites.push(mockGroup[groupIndex].groupName)
            return res(ctx.json(inviteUser[0].groups))
          }
        } else
          return res(ctx.status(400), ctx.json("You do not have permission to invite to this group"))
      }
    }),

    rest.post('http://localhost:8080/groups/:groupID/createCollection', async (req, res, ctx) => {
      const data = await req.json()
      const userCheck = data.userID;
      const groupCheck = parseInt(req.params.groupID)
      const userIndex = mockDBGroups.filter((user) => user._id === userCheck)
      if(userIndex[0].user_id == 0)
       return res(ctx.status(400))
      else{
        let lastID = 0;
        const groupIndex = mockGroup.findIndex((group) => group._id === groupCheck)
        if(mockGroup[groupIndex].collections && mockGroup[groupIndex].collections.length !== 0){
          const lastCollection = mockGroup[groupIndex].collections.length - 1
          lastID = mockGroup[groupIndex].collections[lastCollection]._id
        }
        if(mockGroup[groupIndex].groupMembers.includes(userIndex[0].username) || mockGroup[groupIndex].groupAdmin.includes(userIndex[0].username)){
          const newCollection = {collectionTitle: data.title, collectionDescription: data.desc, 
            collectionStatus: "Incomplete", _id: lastID + 1, tasks: []}
          mockGroup[groupIndex].collections.push(newCollection)
          return res(ctx.json(mockGroup[groupIndex].collections))
        } else
          return res(ctx.status(400), ctx.json("You do not have permission to create a collection in this group"))
      }
    }),

    rest.post('http://localhost:8080/groups/:groupID/updateCollection', async (req, res, ctx) => {
      const data = await req.json()
      const userCheck = data.userID;
      const groupCheck = parseInt(req.params.groupID)
      const userIndex = mockDBGroups.filter((user) => user._id === userCheck)
      if(userIndex[0].user_id == 0)
       return res(ctx.status(400))
      else{
        const groupIndex = mockGroup.findIndex((group) => group._id === groupCheck)
        if(mockGroup[groupIndex].groupMembers.includes(userIndex[0].username) || mockGroup[groupIndex].groupAdmin.includes(userIndex[0].username)){
          const collectionIndex = mockGroup[groupIndex].collections.findIndex((collection) => collection._id === data.collectionID)
          mockGroup[groupIndex].collections[collectionIndex].collectionTitle = data.newColTitle
          mockGroup[groupIndex].collections[collectionIndex].collectionDescription = data.newColDesc
          return res(ctx.json(mockGroup[groupIndex].collections))
        } else
          return res(ctx.status(400), ctx.json("You do not have permission to update this collection"))
      }
    }),

    rest.delete('http://localhost:8080/groups/:groupID/deleteCollection/:collectionID/:userID', async (req, res, ctx) => {
      const collectionCheck = parseInt(req.params.collectionID)
      const groupCheck = parseInt(req.params.groupID)
      const userCheck = parseInt(req.params.userID)
      const userIndex = mockDBGroups.filter((user) => user._id === userCheck)
      const groupIndex = mockGroup.findIndex((group) => group._id === groupCheck)
      if(userIndex[0]._id == 0)
       return res(ctx.status(400))
      else{
        if(mockGroup[groupIndex].groupMembers.includes(userIndex[0].username) || mockGroup[groupIndex].groupAdmin.includes(userIndex[0].username)){
          const deleteCollection = mockGroup[groupIndex].collections.filter((collection) => collection._id != collectionCheck)
          return res(ctx.json(deleteCollection))
        } else
          return res(ctx.status(400), ctx.json("You do not have permission to delete this collection"))
      }
    }),

    rest.delete('http://localhost:8080/groups/:groupID/deleteGroup/:userID', async (req, res, ctx) => {
      const groupCheck = parseInt(req.params.groupID)
      const userCheck = parseInt(req.params.userID)
      const userIndex = mockDBGroups.filter((user) => user._id === userCheck)
      const groupIndex = mockGroup.findIndex((group) => group._id === groupCheck)
      if(userIndex[0].user_id == 0)
       return res(ctx.status(400))
      else{
        if(mockGroup[groupIndex].groupAdmin.includes(userIndex[0].username)){
          const deleteGroup = mockGroup.filter((group) => group._id != groupCheck)
          return res(ctx.json(deleteGroup))
        } else
          return res(ctx.status(400), ctx.json("You do not have permission to delete this group"))
      }
    }),

    // --------------------------------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------------------------------
    // -------------------------------------- Group Collection Tasks Page Handlers ----------------------------------------------------
    // --------------------------------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------------------------------

    rest.post('http://localhost:8080/groups/:groupID/addCollection/newTask', async (req, res, ctx) => {
      const data = await req.json()
      const userCheck = data.userID;
      const groupCheck = parseInt(req.params.groupID)
      const userIndex = mockDBGroups.filter((user) => user._id === userCheck)
      if(userIndex[0].user_id == 0)
       return res(ctx.status(400))
      else{
          const groupIndex = mockGroupTasks.findIndex((group) => group._id === groupCheck)
          const collectionIndex = mockGroupTasks[groupIndex].collections.findIndex((collection) => collection._id === data.collectionID)
          let nextId = 1;
          let lastTask = [];
          try{
          const dbCollection = mockGroupTasks[groupIndex].collections[collectionIndex]
          let localCopy = JSON.parse(JSON.stringify(dbCollection))
          if(localCopy.tasks)
              lastTask = localCopy.tasks.pop();
          if(lastTask.length !== 0)
              nextId = lastTask._id + 1;}
          catch(error){}
          const newTask = {title: data.title, description: data.desc, 
            status: data.status, _id: nextId}

          if(mockGroupTasks[groupIndex].groupMembers.includes(userIndex[0].username) || mockGroupTasks[groupIndex].groupAdmin.includes(userIndex[0].username)){
            mockGroupTasks[groupIndex].collections[collectionIndex].tasks.push(newTask)
            return res(ctx.json(mockGroupTasks[groupIndex].collections[collectionIndex]))
          } else
            return res(ctx.status(400), ctx.json("You do not have permission to add a task to this collection"))
        }
    }),

    rest.post('http://localhost:8080/groups/:groupID/updateCollection/task/data', async (req, res, ctx) => {
      const data = await req.json()
      const userCheck = data.userID;
      const groupCheck = parseInt(req.params.groupID)
      const userIndex = mockDBGroups.filter((user) => user._id === userCheck)
      if(userIndex[0].user_id == 0)
       return res(ctx.status(400))
      else{
        const groupIndex = mockGroupTasks.findIndex((group) => group._id === groupCheck)
        const collectionIndex = mockGroupTasks[groupIndex].collections.findIndex((collection) => collection._id === data.collectionID)
        const taskIndex = mockGroupTasks[groupIndex].collections[collectionIndex].tasks.findIndex((task) => task._id === data.taskID)
          if(mockGroupTasks[groupIndex].groupMembers.includes(userIndex[0].username) || mockGroupTasks[groupIndex].groupAdmin.includes(userIndex[0].username)){
          mockGroupTasks[groupIndex].collections[collectionIndex].tasks[taskIndex].title = data.newTitle
          mockGroupTasks[groupIndex].collections[collectionIndex].tasks[taskIndex].description = data.newDesc
          return res(ctx.json(mockGroupTasks[groupIndex].collections[collectionIndex].tasks))
        } else
          return res(ctx.status(400), ctx.json("You do not have permission to update this task"))
      }
    }),

    rest.post('http://localhost:8080/groups/:groupID/updateCollection/task/status', async (req, res, ctx) => {
      const data = await req.json()
      const userCheck = data.userID;
      const groupCheck = parseInt(req.params.groupID)
      const userIndex = mockDBGroups.filter((user) => user._id === userCheck)
      if(userIndex[0].user_id == 0)
       return res(ctx.status(400))
      else{
        const groupIndex = mockGroupTasks.findIndex((group) => group._id === groupCheck)
        const collectionIndex = mockGroupTasks[groupIndex].collections.findIndex((collection) => collection._id === data.collectionID)
        const taskIndex = mockGroupTasks[groupIndex].collections[collectionIndex].tasks.findIndex((task) => task._id === data.taskID)
        if(mockGroupTasks[groupIndex].groupMembers.includes(userIndex[0].username) || mockGroupTasks[groupIndex].groupAdmin.includes(userIndex[0].username)){
          mockGroupTasks[groupIndex].collections[collectionIndex].tasks[taskIndex].status = data.newStatus
          return res(ctx.json(mockGroupTasks[groupIndex].collections[collectionIndex].tasks))
        } else
          return res(ctx.status(400), ctx.json("You do not have permission to update this task"))
      }
    }),

    rest.delete('http://localhost:8080/groups/:groupID/deleteCollection/deleteTask/:userID/:collectionID/:taskID', async (req, res, ctx) => {
      const collectionCheck = parseInt(req.params.collectionID)
      const taskCheck = parseInt(req.params.taskID)
      const groupCheck = parseInt(req.params.groupID)
      const userCheck = parseInt(req.params.userID)
      const userIndex = mockDBGroups.filter((user) => user._id === userCheck)
      const groupIndex = mockGroupTasks.findIndex((group) => group._id === groupCheck)
      if(userIndex[0].user_id == 0)
       return res(ctx.status(400))
      else{
        if(mockGroupTasks[groupIndex].groupMembers.includes(userIndex[0].username) || mockGroupTasks[groupIndex].groupAdmin.includes(userIndex[0].username)){
          const collectionIndex = mockGroupTasks[groupIndex].collections.findIndex((collection) => collection._id === collectionCheck)
          const deleteTask = mockGroupTasks[groupIndex].collections[collectionIndex].tasks.filter((task) => task._id != taskCheck)
          return res(ctx.json(deleteTask))
        } else
          return res(ctx.status(400), ctx.json("You do not have permission to delete this task"))
      }
    }),
]