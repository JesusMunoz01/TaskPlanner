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

    test.skip('Adds a new task', async () => {

    })

    test.skip('Adds a second new task', async () => {

    })

    test.skip('Test task display with fake data', async () => {

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
