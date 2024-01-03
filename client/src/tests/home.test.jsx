import React from 'react'
import { render, cleanup, act} from '@testing-library/react'
import { Home } from '../pages/home'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'


const user = userEvent.setup();

const updateTask = (data) => {}

describe('Testing basic home page', () => {
    
    test('Testing no data', async () => {
        const renderedHome = render(<Home />)
        
        expect(await renderedHome.queryByLabelText(/^delBtn/)).not.toBeInTheDocument()
    })

    test('Adds a new task', async () => {
        const renderedHome = render(<Home updateTask={updateTask}/>)
        const inputTitle = await renderedHome.findByLabelText('addTaskTitle')
        const inputDesc = await renderedHome.findByLabelText('addTaskDesc')
        const confirmAdd = await renderedHome.findByLabelText('confirmAdd')

        await act(async () => {
            await user.type(inputTitle, "New Task")
            await user.type(inputDesc, "New Desc")
            await user.click(confirmAdd)
        })

        const tasks = await renderedHome.findAllByTestId(/^task/);
        
        expect(tasks.length).toEqual(1)
        expect(inputTitle.value).toEqual("")
        expect(inputDesc.value).toEqual("")
    })

    test('Adds a second new task', async () => {
        const renderedHome = render(<Home updateTask={updateTask}/>)
        const inputTitle = await renderedHome.findByLabelText('addTaskTitle')
        const inputDesc = await renderedHome.findByLabelText('addTaskDesc')
        const confirmAdd = await renderedHome.findByLabelText('confirmAdd')

        await act(async () => {
            await user.type(inputTitle, "New Task2")
            await user.type(inputDesc, "New Desc2")
            await user.click(confirmAdd)
        })

        const tasks = await renderedHome.findAllByTestId(/^task/);
        
        expect(tasks.length).toEqual(2)
        expect(inputTitle.value).toEqual("")
        expect(inputDesc.value).toEqual("")
    })

    test('Test task display with fake data', async () => {
        const renderedHome = render(<Home data={JSON.stringify([{title: "test", description: "test desc", _id: 1}])} updateTask={updateTask}/>)

        const tasks = await renderedHome.findAllByTestId(/^task/);
        
        expect(tasks.length).toEqual(1)
    })

    test('Test task deletion', async () => {
        const renderedHome = render(<Home data={JSON.stringify([{title: "test", description: "test desc", _id: 2}])} updateTask={updateTask}/>)

        const delBtn = await renderedHome.findByLabelText("delBtn2");

        await act(async () => {
            await user.click(delBtn)
        })

        const tasks = await renderedHome.queryAllByTestId(/^task/);
        
        expect(tasks.length).toEqual(0)
    })

})

describe('Testing home page with set local storage data', () => {

    beforeEach(() => {
        localStorage.clear()
    })

    test('Adds a new task with one task already in local storage', async () => {
        const mockData = [{title: "test", description: "test desc", _id: 1}]
        localStorage.setItem("localTaskData", JSON.stringify(mockData));
        const renderedHome = render(<Home updateTask={updateTask}/>)
        const inputTitle = await renderedHome.findByLabelText('addTaskTitle')
        const inputDesc = await renderedHome.findByLabelText('addTaskDesc')
        const confirmAdd = await renderedHome.findByLabelText('confirmAdd')

        await act(async () => {
            await user.click(inputTitle)
            await user.keyboard("Test")
            await user.type(inputDesc, "New Desc")
            await user.click(confirmAdd)
        })

        const tasks = await renderedHome.findAllByTestId(/^task/);
        
        expect(tasks.length).toEqual(2)
        expect(inputTitle.value).toEqual("")
        expect(inputDesc.value).toEqual("")
    })
    
    test('Test task update', async () => {
        const mockData = [{title: "test", description: "test desc", _id: 1}]
        localStorage.setItem("localTaskData", JSON.stringify(mockData));

        const renderedHome = render(<Home data={JSON.stringify(mockData)} updateTask={updateTask}/>)

        const updateTitle = await renderedHome.findByLabelText('editTaskTitle1')
        const updateDesc = await renderedHome.findByLabelText('editTaskDesc1')
        const confirmUpdate = await renderedHome.findByLabelText('confirmEdit1')

        await act(async () => {
            await user.type(updateTitle, "Updated Title")
            await user.type(updateDesc, "Updated Desc")
            await user.click(confirmUpdate)
        })

        const task = await renderedHome.findByLabelText("taskTitle1");
        
        expect(task.innerHTML).toEqual("Updated Title")
    })
})


describe('Testing mock API calls for home page', () => {

    const mockDB = [{_id: 1, tasks: [{title: "mock1", description: "fake response 1", _id: 1},
          {title: "mock2", description: "fake response 2", _id: 2},
          {title: "mock3", description: "fake response 3", _id: 3}]
        },
                {_id: 2, tasks: [{title: "mock1", description: "fake response 1", _id: 1},
          {title: "mock2", description: "fake response 2", _id: 2},
          {title: "mock3", description: "fake response 3", _id: 3}]
        },
                {_id: 3, tasks: []
        }]

    test('Test to see if tasks are empty', async () => {
        window.localStorage.setItem("userId", 3);
        const response = await fetch(`http://localhost:8080/fetchTasks/${localStorage.getItem("userId")}`)
        expect(await response.json()).toEqual([])
    })

    test('Test to see if there are tasks', async () => {
        window.localStorage.setItem("userId", 1);
        const response = await fetch(`http://localhost:8080/fetchTasks/${localStorage.getItem("userId")}`)
        expect(await response.json()).toEqual(mockDB[0].tasks)
    })
    
    test('Test to add a task on user 1 (has 3 tasks)', async () => {
        const userID = 1;
        const title = "new task";
        const desc = "test desc";
        const response = await fetch(`http://localhost:8080/addTask`, {
            method: "POST", headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID,
                title,
                desc,
                status: "incomplete"
                })
            });
        const addedTask = {title: title, description: desc, status: "incomplete", _id: 4}
        const updatedData = await response.json();
        expect(updatedData.length).toEqual(4)
        expect(updatedData).toEqual([...mockDB[0].tasks, addedTask])
    })

    test('Test to add a task on user 3 (has no tasks)', async () => {
        const userID = 3;
        const title = "first task";
        const desc = "test desc";
        const response = await fetch(`http://localhost:8080/addTask`, {
            method: "POST", headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID,
                title,
                desc,
                status: "incomplete"
                })
            });
        const updatedData = await response.json();
        expect(updatedData.length).toEqual(1)
        expect(updatedData).toEqual([{title: "first task", description: "test desc", status: "incomplete", _id: 0}])
    })

    test('Test delete a task ', async () => {
        const userID = 2;
        const taskId = 2;
        const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
            method: "DELETE", body: JSON.stringify({userID})
        });
        const updatedData = await response.json();
        expect(updatedData.length).toEqual(2)
        expect(updatedData).toEqual([{title: "mock1", description: "fake response 1", _id: 1},
        {title: "mock3", description: "fake response 3", _id: 3}])
    })

    test('Test to update a task ', async () => {
        const userID = 1;
        const taskID = 3
        const newTitle = "updated mock3"
        const newDesc = "updated fake response 3"
        const response = await fetch(`http://localhost:8080/updateTaskInfo`, {
            method: "POST", headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID,
                taskID,
                newTitle,
                newDesc
                })
            });
        const updatedData = await response.json();
        expect(updatedData.length).toEqual(4)
        expect(updatedData).toEqual([{title: "mock1", description: "fake response 1", _id: 1},
        {title: "mock2", description: "fake response 2", _id: 2},
        {title: "updated mock3", description: "updated fake response 3", _id: 3},
        {title: "new task", description: "test desc", status: "incomplete", _id: 4}])
    })
})
