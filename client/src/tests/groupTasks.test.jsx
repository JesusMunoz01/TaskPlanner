import React from 'react'
import { render, cleanup, act} from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { GroupCollectionTasks } from '../pages/groupCollectionTasks'
import { UserContext } from '../App'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const user = userEvent.setup();

// addTaskTitle, addTaskDesc, confirmAdd, taskTitle1, taskDesc1, editTaskTitle1, editTaskDesc1, confirmEdit1, delBtn1
// /^task/

describe('Testing group tasks', () => {
    
    test('Testing no data', async () => {
        let groupData = {invites: ["testGroup"], joined: [{_id: "1", groupName: 'Test Group', groupDescription: 'Test Description', permissions: 'Admin',
            collections: [{_id: "1", collectionTitle: 'Test Collection', collectionDesc: 'Test Collection Description', tasks: []}]}, ]}
        const setGroupData = newData => {groupData = newData};

        const renderedGroupTasks = render(
            <UserContext.Provider value={{groupData, setGroupData}}>
                <MemoryRouter initialEntries={[`/groups/${1}/${1}/tasks`]}>
                    <Routes>
                        <Route path="/groups/:groupID/:collectionID/tasks" 
                            element={<GroupCollectionTasks isUserLogged={true}/>} />
                    </Routes>
                </MemoryRouter>
            </UserContext.Provider>
        )

        const noData = renderedGroupTasks.getByText('Currently no tasks in this collection')
        expect(noData).toBeInTheDocument()
    })

    test('Test task display with fake data', async () => {
        let groupData = {invites: ["testGroup"], joined: [{_id: "1", groupName: 'Test Group', groupDescription: 'Test Description', permissions: 'Admin',
            collections: [{_id: "1", collectionTitle: 'Test Collection', collectionDesc: 'Test Collection Description', 
            tasks: [{_id: "1", title: 'Test Task', description: 'Test Task Description', status: 'Incomplete'}]}]}]}
        const setGroupData = newData => {groupData = newData};

        const renderedGroupTasks = render(
            <UserContext.Provider value={{groupData, setGroupData}}>
                <MemoryRouter initialEntries={[`/groups/${1}/${1}/tasks`]}>
                    <Routes>
                        <Route path="/groups/:groupID/:collectionID/tasks" 
                            element={<GroupCollectionTasks isUserLogged={true}/>} />
                    </Routes>
                </MemoryRouter>
            </UserContext.Provider>
        )

        const tasks = await renderedGroupTasks.findAllByTestId(/^colTask-item/)
        const taskTitle = renderedGroupTasks.getByText('Test Task')

        expect(taskTitle).toBeInTheDocument()
        expect(tasks.length).toEqual(1)
    })

    test('Adds a task with no other tasks present', async () => {
        let groupData = {invites: ["testGroup"], joined: [{_id: "1", groupName: 'Test Group', groupDescription: 'Test Description', permissions: 'Admin',
        collections: [{_id: "1", collectionTitle: 'Test Collection', collectionDesc: 'Test Collection Description', tasks: []}]}]}
        const setGroupData = newData => {groupData = newData};
        localStorage.setItem('userId', 2)

        const fetchCopy = global.fetch;
        global.__API__ = 'http://localhost:8000'
        global.fetch = jest.fn()
        global.fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve()}))

        const renderedGroupTasks = render(
            <UserContext.Provider value={{groupData, setGroupData}}>
                <MemoryRouter initialEntries={[`/groups/${1}/${1}/tasks`]}>
                    <Routes>
                        <Route path="/groups/:groupID/:collectionID/tasks" 
                            element={<GroupCollectionTasks isUserLogged={true}/>} />
                    </Routes>
                </MemoryRouter>
            </UserContext.Provider>
        )

        const addTaskTitle = renderedGroupTasks.getByLabelText('addColTaskTitle')
        const addTaskDesc = renderedGroupTasks.getByLabelText('addColTaskDesc')
        const confirmAdd = renderedGroupTasks.getByLabelText('confirmColTaskAdd')

        await act(async () => {
            await user.type(addTaskTitle, 'Created Task')
            await user.type(addTaskDesc, 'Created Task Description')
            await user.click(confirmAdd)
        })

        expect(global.fetch).toHaveBeenCalledWith("http://localhost:8000/groups/1/addCollection/newTask", 
            {"body": "{\"userID\":\"2\",\"currentCollectionIndex\":0,\"collectionTaskTitle\":\"Created Task\",\"collectionTaskDesc\":\"Created Task Description\",\"status\":\"Incomplete\"}", "headers": {"Content-Type": "application/json", "auth": undefined},
            "method": "POST"})
        expect(global.fetch).toHaveBeenCalledTimes(1)
        global.fetch = fetchCopy
    })

    test('Adds a task with other tasks present', async () => {
        let groupData = {invites: ["testGroup"], joined: [{_id: "1", groupName: 'Test Group', groupDescription: 'Test Description', permissions: 'Admin',
            collections: [{_id: "1", collectionTitle: 'Test Collection', collectionDesc: 'Test Collection Description', 
            tasks: [{_id: "1", title: 'Test Task', description: 'Test Task Description', status: 'Incomplete'}]}]}]}
        const setGroupData = newData => {groupData = newData};
        localStorage.setItem('userId', 2)

        const fetchCopy = global.fetch;
        global.__API__ = 'http://localhost:8000'
        global.fetch = jest.fn()
        global.fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve()}))

        const renderedGroupTasks = render(
            <UserContext.Provider value={{groupData, setGroupData}}>
                <MemoryRouter initialEntries={[`/groups/${1}/${1}/tasks`]}>
                    <Routes>
                        <Route path="/groups/:groupID/:collectionID/tasks" 
                            element={<GroupCollectionTasks isUserLogged={true}/>} />
                    </Routes>
                </MemoryRouter>
            </UserContext.Provider>
        )

        const addTaskTitle = renderedGroupTasks.getByLabelText('addColTaskTitle')
        const addTaskDesc = renderedGroupTasks.getByLabelText('addColTaskDesc')
        const confirmAdd = renderedGroupTasks.getByLabelText('confirmColTaskAdd')

        await act(async () => {
            await user.type(addTaskTitle, 'Created Task')
            await user.type(addTaskDesc, 'Created Task Description')
            await user.click(confirmAdd)
        })

        expect(global.fetch).toHaveBeenCalledWith("http://localhost:8000/groups/1/addCollection/newTask", 
            {"body": "{\"userID\":\"2\",\"currentCollectionIndex\":0,\"collectionTaskTitle\":\"Created Task\",\"collectionTaskDesc\":\"Created Task Description\",\"status\":\"Incomplete\"}", "headers": {"Content-Type": "application/json", "auth": undefined},
            "method": "POST"})
        expect(global.fetch).toHaveBeenCalledTimes(1)
        global.fetch = fetchCopy
    })


    test('Test task deletion', async () => {
        let groupData = {invites: ["testGroup"], joined: [{_id: "1", groupName: 'Test Group', groupDescription: 'Test Description', permissions: 'Admin',
        collections: [{_id: "1", collectionTitle: 'Test Collection', collectionDesc: 'Test Collection Description', 
        tasks: [{_id: "1", title: 'Test Task', description: 'Test Task Description', status: 'Incomplete'}]}]}]}
        const setGroupData = newData => {groupData = newData};

        const fetchCopy = global.fetch;
        global.__API__ = 'http://localhost:8000'
        global.fetch = jest.fn()
        global.fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve()}))

        const renderedGroupTasks = render(
            <UserContext.Provider value={{groupData, setGroupData}}>
                <MemoryRouter initialEntries={[`/groups/${1}/${1}/tasks`]}>
                    <Routes>
                        <Route path="/groups/:groupID/:collectionID/tasks" 
                            element={<GroupCollectionTasks isUserLogged={true}/>} />
                    </Routes>
                </MemoryRouter>
            </UserContext.Provider>
        )

        const delBtn = renderedGroupTasks.getByLabelText('delColTaskBtn1')

        await act(async () =>{
            await user.click(delBtn)
        })

        expect(global.fetch).toHaveBeenCalledWith("http://localhost:8000/groups/1/deleteCollection/deleteTask/2/1/1",
            {"headers": {"auth": undefined},"method": "DELETE"})
        expect(global.fetch).toHaveBeenCalledTimes(1)
        global.fetch = fetchCopy
    })

    test('Test task update data', async () => {
        let groupData = {invites: ["testGroup"], joined: [{_id: "1", groupName: 'Test Group', groupDescription: 'Test Description', permissions: 'Admin',
            collections: [{_id: "1", collectionTitle: 'Test Collection', collectionDesc: 'Test Collection Description', 
            tasks: [{_id: "1", title: 'Test Task', description: 'Test Task Description', status: 'Incomplete'}]}]}]}
        const setGroupData = newData => {groupData = newData};
        localStorage.setItem('userId', 2)

        const fetchCopy = global.fetch;
        global.__API__ = 'http://localhost:8000'
        global.fetch = jest.fn()
        global.fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve()}))

        const renderedGroupTasks = render(
            <UserContext.Provider value={{groupData, setGroupData}}>
                <MemoryRouter initialEntries={[`/groups/${1}/${1}/tasks`]}>
                    <Routes>
                        <Route path="/groups/:groupID/:collectionID/tasks" 
                            element={<GroupCollectionTasks isUserLogged={true}/>} />
                    </Routes>
                </MemoryRouter>
            </UserContext.Provider>
        )

        const addTaskTitle = renderedGroupTasks.getByLabelText('editColTaskTitle1')
        const addTaskDesc = renderedGroupTasks.getByLabelText('editColTaskDesc1')
        const confirmAdd = renderedGroupTasks.getByLabelText('confirmColTaskEdit1')

        await act(async () => {
            await user.type(addTaskTitle, 'Edited Task')
            await user.type(addTaskDesc, 'Edited Task Description')
            await user.click(confirmAdd)
        })

        expect(global.fetch).toHaveBeenCalledWith("http://localhost:8000/groups/1/updateCollection/task/data", 
            {"body": "{\"userID\":\"2\",\"collectionID\":\"1\",\"collectionIndex\":0,\"taskID\":\"1\",\"newTitle\":\"Edited Task\",\"newDesc\":\"Edited Task Description\"}",
            "headers": {"Content-Type": "application/json", "auth": undefined}, "method": "POST"})
        expect(global.fetch).toHaveBeenCalledTimes(1)
        global.fetch = fetchCopy
    })

    test('Test task update status', async () => {
        let groupData = {invites: ["testGroup"], joined: [{_id: "1", groupName: 'Test Group', groupDescription: 'Test Description', permissions: 'Admin',
        collections: [{_id: "1", collectionTitle: 'Test Collection', collectionDesc: 'Test Collection Description', 
        tasks: [{_id: "1", title: 'Test Task', description: 'Test Task Description', status: 'Incomplete'}]}]}]}
        const setGroupData = newData => {groupData = newData};
        localStorage.setItem('userId', 2)

        const fetchCopy = global.fetch;
        global.__API__ = 'http://localhost:8000'
        global.fetch = jest.fn()
        global.fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve()}))

        const renderedGroupTasks = render(
            <UserContext.Provider value={{groupData, setGroupData}}>
                <MemoryRouter initialEntries={[`/groups/${1}/${1}/tasks`]}>
                    <Routes>
                        <Route path="/groups/:groupID/:collectionID/tasks" 
                            element={<GroupCollectionTasks isUserLogged={true}/>} />
                    </Routes>
                </MemoryRouter>
            </UserContext.Provider>
        )

        const statusSelector = renderedGroupTasks.getByLabelText('colTaskStatus')
        const completeStatus = renderedGroupTasks.getByLabelText('completeColTaskStatus')

        await act(async () => {
            await user.selectOptions(statusSelector, completeStatus)
        })

        expect(global.fetch).toHaveBeenCalledWith("http://localhost:8000/groups/1/updateCollection/task/status", 
            {"body": "{\"userID\":\"2\",\"collectionID\":\"1\",\"collectionIndex\":0,\"taskID\":\"1\",\"taskStatus\":\"Complete\"}",
            "headers": {"Content-Type": "application/json", "auth": undefined}, "method": "POST"})
        expect(global.fetch).toHaveBeenCalledTimes(1)
        global.fetch = fetchCopy
    })

})


describe('Testing mock API calls for group tasks page', () => {

    
    test('Test to add a task on group 1 (has no task)', async () => {
        const response = await fetch('http://localhost:8080/groups/1/addCollection/newTask', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                userID: 1, 
                collectionID: 1, 
                title: 'Created Task', 
                desc: 'Created Task Description', 
                status: 'Incomplete'
            })
        })

        const data = await response.json()
        expect(data).toEqual({_id: 1, collectionTitle: 'mockCollection1 group1', collectionDescription: 'fake collection response 1', collectionStatus: "Incomplete",
            tasks: [{_id: 1, title: 'Created Task', description: 'Created Task Description', status: 'Incomplete'}]})
    })

    test('Test to add a task on group 2 (has 1 tasks)', async () => {
        const response = await fetch('http://localhost:8080/groups/2/addCollection/newTask', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                userID: 1, 
                collectionID: 1, 
                title: 'Created Task', 
                desc: 'Created Task Description', 
                status: 'Incomplete'
            })
        })

        const data = await response.json()
        expect(data).toEqual({_id: 1, collectionTitle: 'mockCollection1 group2', collectionDescription: 'fake collection response 2', collectionStatus: "Incomplete",
            tasks: [{_id: 1, title: 'Task1', description: 'Fake Task 1', status: 'Incomplete'}, {_id: 2, title: 'Created Task', 
            description: 'Created Task Description', status: 'Incomplete'}]})
    })

    test.skip('Test delete a task ', async () => {

    })

    test.skip('Test to update a task ', async () => {

    })

    test.skip('Test to update a task status', async () => {

    })
    
})
