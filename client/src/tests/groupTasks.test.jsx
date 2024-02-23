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

    test.skip('Adds a second new task', async () => {

    })


    test.skip('Test task deletion', async () => {

    })

    test.skip('Test task update data', async () => {
            
    })

    test.skip('Test task update status', async () => {

    })

})


describe('Testing mock API calls for group tasks page', () => {

    test.skip('Test to see if tasks are empty', async () => {
    
    })

    test.skip('Test to see if there are tasks', async () => {

    })
    
    test.skip('Test to add a task on user 1 (has 3 tasks)', async () => {

    })

    test.skip('Test to add a task on user 3 (has no tasks)', async () => {

    })

    test.skip('Test delete a task ', async () => {

    })

    test.skip('Test to update a task ', async () => {

    })
})
