import { Home } from '../pages/home'
import { render, screen, cleanup, act } from '@testing-library/react'
import user from '@testing-library/user-event'
import React from 'react'

describe('Testing basic home page', () => {

    afterEach(cleanup)
    
    test('Testing no data', async () => {
        const renderedHome = render(<Home />)
        
        expect(await renderedHome.queryByLabelText("delBtn")).not.toBeInTheDocument()
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