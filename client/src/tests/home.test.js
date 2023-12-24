import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen, cleanup, act } from '@testing-library/react'
import { Home } from '../pages/home'
import '@testing-library/jest-dom'
import user from '@testing-library/user-event'
import App from '../App'

/*
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
*/


describe('Testing basic home page', () => {

    afterEach(cleanup)
    
    test('Testing no data', async () => {
        const renderedHome = render(<Home />)
        
        expect(await renderedHome.queryByLabelText(/^delBtn/)).not.toBeInTheDocument()
    })

    test('Adds a new task', async () => {
        const renderedHome = render(<Home />)
        const inputTitle = await renderedHome.findByLabelText('addTaskTitle')
        const inputDesc = await renderedHome.findByLabelText('addTaskDesc')
        const confirmAdd = await renderedHome.findByLabelText('confirmAdd')

        await act(async () => {
            user.type(inputTitle, "New Task")
            user.type(inputDesc, "New Desc")
            user.click(confirmAdd)
        })

        const tasks = await renderedHome.findAllByTestId(/^task/);
        
        expect(tasks.length).toEqual(1)
        expect(inputTitle.value).toEqual("")
        expect(inputDesc.value).toEqual("")
    })

    test('Adds a second new task', async () => {
        const renderedHome = render(<Home />)
        const inputTitle = await renderedHome.findByLabelText('addTaskTitle')
        const inputDesc = await renderedHome.findByLabelText('addTaskDesc')
        const confirmAdd = await renderedHome.findByLabelText('confirmAdd')

        await act(async () => {
            user.type(inputTitle, "New Task")
            user.type(inputDesc, "New Desc")
            user.click(confirmAdd)
        })

        const tasks = await renderedHome.findAllByTestId(/^task/);
        
        expect(tasks.length).toEqual(2)
        expect(inputTitle.value).toEqual("")
        expect(inputDesc.value).toEqual("")
    })

    test('Test task display with fake data', async () => {
        const renderedHome = render(<Home data={JSON.stringify([{title: "test", description: "test desc", _id: 1}])}/>)

        const tasks = await renderedHome.findAllByTestId(/^task/);
        
        expect(tasks.length).toEqual(1)
    })

    test('Test task deletion', async () => {
        const renderedHome = render(<Home data={JSON.stringify([{title: "test", description: "test desc", _id: 1}])}/>)

        const delBtn = await renderedHome.findByLabelText("delBtn1");

        await act(async () => {
            user.click(delBtn)
        })

        const tasks = await renderedHome.queryAllByTestId(/^task/);
        
        expect(tasks.length).toEqual(0)
    })

})

describe('Testing home page with local storage', () => {
    beforeEach(() => {    
        const localStorageMock = (function () {
            let store = {};
        
            return {
            getItem(key) {
                return store[key];
            },
        
            setItem(key, value) {
                store[key] = value;
            },
        
            clear() {
                store = {};
            },
        
            removeItem(key) {
                delete store[key];
            },
        
            getAll() {
                return store;
            },
            };
      })();
      
      Object.defineProperty(window, "localStorage", { value: localStorageMock });})

    afterEach(cleanup)

    test('Adds a new task with one task already in local storage', async () => {
        const mockData = [{title: "test", description: "test desc", _id: 1}]
        window.localStorage.setItem("localTaskData", JSON.stringify(mockData));
        const renderedHome = render(<Home />)
        const inputTitle = await renderedHome.findByLabelText('addTaskTitle')
        const inputDesc = await renderedHome.findByLabelText('addTaskDesc')
        const confirmAdd = await renderedHome.findByLabelText('confirmAdd')

        await act(async () => {
            user.type(inputTitle, "New Task")
            user.type(inputDesc, "New Desc")
            user.click(confirmAdd)
        })

        const tasks = await renderedHome.findAllByTestId(/^task/);
        
        expect(tasks.length).toEqual(2)
        expect(inputTitle.value).toEqual("")
        expect(inputDesc.value).toEqual("")
    })
    
    test('Test task update', async () => {
        const mockData = [{title: "test", description: "test desc", _id: 1}]

        window.localStorage.setItem("localTaskData", JSON.stringify(mockData));

        const renderedHome = render(<Home data={JSON.stringify(mockData)}/>)

        const dropDownEditBtn = await renderedHome.findByLabelText('editDropdown1')
        const updateTitle = await renderedHome.findByLabelText('editTaskTitle1')
        const updateDesc = await renderedHome.findByLabelText('editTaskDesc1')
        const confirmUpdate = await renderedHome.findByLabelText('confirmEdit1')

        await act(async () => {
            user.click(dropDownEditBtn)
            user.type(updateTitle, "Updated Title")
            user.type(updateDesc, "Updated Desc")
            user.click(confirmUpdate)
        })

        const task = await renderedHome.findByLabelText("taskTitle1");
        
        expect(task.innerHTML).toEqual("Updated Title")
    })
})

describe('Testing home page with mock API calls', () => {
    beforeEach(() => {    
        const localStorageMock = (function () {
            let store = {};
        
            return {
            getItem(key) {
                return store[key];
            },
        
            setItem(key, value) {
                store[key] = value;
            },
        
            clear() {
                store = {};
            },
        
            removeItem(key) {
                delete store[key];
            },
        
            getAll() {
                return store;
            },
            };
      })();
      
      Object.defineProperty(window, "localStorage", { value: localStorageMock });})
/*
    const server = setupServer(
        rest.get('/fetchTasks/:userID', (req, res, ctx) => {
            const userCheck = req.params.userID
            const index = mockDB.findIndex((user => user._id === userCheck))
            if(index == 0)
              return res(ctx.status(400))
            else{
              return res(
                ctx.status(200),
                ctx.json(mockDB[index].tasks))
            }
        })
    )

    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())


    test('Test to see if tasks are empty', async () => {
        window.localStorage.setItem("userId", 3);
        const renderedApp = render(<App />)
        expect(await renderedApp.queryByLabelText(/^delBtn/)).not.toBeInTheDocument()
    })
    
    test('Test to add a task when there are no tasks ', async () => {
        window.localStorage.setItem("userId", 1);
        const renderedApp = render(<App />)
        const task1 = screen.findByText("mock1")
        expect(task1).toBeInTheDocument();
    })

    test.skip('Test to add a task when there are already tasks', async () => {

    })

    test.skip('Test delete a task ', async () => {

    })

    test.skip('Test to update a task ', async () => {

    })
*/
})