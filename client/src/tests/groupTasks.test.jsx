import React from 'react'
import { render, cleanup, act} from '@testing-library/react'
import { Home } from '../pages/home'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

const user = userEvent.setup();

// addTaskTitle, addTaskDesc, confirmAdd, taskTitle1, taskDesc1, editTaskTitle1, editTaskDesc1, confirmEdit1, delBtn1
// /^task/

describe('Testing group tasks', () => {
    
    test.skip('Testing no data', async () => {

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
