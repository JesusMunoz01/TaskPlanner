import React from 'react'
import { render, screen, cleanup, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import user from '@testing-library/user-event'
import { Collections } from '../pages/collections'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'
import { CollectionTasks } from '../pages/collectionsTasks'

describe('Tests for collections Page', () => {

    const userLogin = false;
    const updateCollection = () => {}
    //const mockData = [{collectionTitle: "Mock Collection", collectionDescription: "Fake description", _id: 1, tasks: []}]

    test('Testing empty tasks in collection', async () => {
        const mockData1 = [{collectionTitle: "Mock Collection", collectionDescription: "Fake description", _id: 1, tasks: []},
        {collectionTitle: "Mock Collection 2", collectionDescription: "Fake description 2", _id: 2, tasks: [{title: "test", description: "test", _id: 1, status: "Incomplete"}]},
        {collectionTitle: "Mock Collection 3", collectionDescription: "Fake description 3", _id: 3, tasks: []}]

        window.localStorage.setItem("localCollectionData", JSON.stringify(mockData1))
        const renderedCollections = render(
        <MemoryRouter>
            <Collections data={JSON.stringify(mockData1)} isLogged={userLogin} updateCollection={updateCollection}/>
            <Routes>
                <Route path="/collections/:collectionID" element={<CollectionTasks data={JSON.stringify(mockData1)} isLogged={userLogin} updateCollection={updateCollection}/>}/>
            </Routes>
        </MemoryRouter>)

        const collectionTitle1 = await renderedCollections.findByLabelText("collectionTitle1")
        await act(async () => {
            await user.click(collectionTitle1)
        })

        expect(renderedCollections.queryByLabelText(/^delColTask/)).not.toBeInTheDocument()
    })

    test('Testing display of tasks in collection', async () => {
        const mockData1 = [{collectionTitle: "Mock Collection", collectionDescription: "Fake description", _id: 1, tasks: []},
        {collectionTitle: "Mock Collection 2", collectionDescription: "Fake description 2", _id: 2, tasks: [{title: "test", description: "test", _id: 1, status: "Incomplete"}]},
        {collectionTitle: "Mock Collection 3", collectionDescription: "Fake description 3", _id: 3, tasks: []}]

        window.localStorage.setItem("localCollectionData", JSON.stringify(mockData1))
        const renderedCollections = render(
        <MemoryRouter>
            <Collections data={JSON.stringify(mockData1)} isLogged={userLogin} updateCollection={updateCollection}/>
            <Routes>
                <Route path="/collections/:collectionID" element={<CollectionTasks data={JSON.stringify(mockData1)} isLogged={userLogin} updateCollection={updateCollection}/>}/>
            </Routes>
        </MemoryRouter>)

        const collectionTitle2 = await renderedCollections.findByLabelText("collectionTitle2")
        await act(async () => {
            await user.click(collectionTitle2)
        })

        expect(renderedCollections.queryByLabelText(/^delColTask/)).toBeInTheDocument()
    })

    test('Testing creating a task in a collection', async () => {
        const mockData1 = [{collectionTitle: "Mock Collection", collectionDescription: "Fake description", _id: 1, tasks: []},
        {collectionTitle: "Mock Collection 2", collectionDescription: "Fake description 2", _id: 2, tasks: [{title: "test", description: "test", _id: 1, status: "Incomplete"}]},
        {collectionTitle: "Mock Collection 3", collectionDescription: "Fake description 3", _id: 3, tasks: []}]

        window.localStorage.setItem("localCollectionData", JSON.stringify(mockData1))
        const renderedCollections = render(
        <MemoryRouter>
            <Collections data={JSON.stringify(mockData1)} isLogged={userLogin} updateCollection={updateCollection}/>
            <Routes>
                <Route path="/collections/:collectionID" element={<CollectionTasks data={JSON.stringify(mockData1)} isLogged={userLogin} updateCollection={updateCollection}/>}/>
            </Routes>
        </MemoryRouter>)

        const collectionTitle1 = await renderedCollections.findByLabelText("collectionTitle1")
        await act(async () => {
            await user.click(collectionTitle1)
        })

        const inputCollectionTaskTaskTitle = await renderedCollections.findByLabelText('addColTaskTitle')
        const inputCollectionTaskDesc = await renderedCollections.findByLabelText('addColTaskDesc')
        const createCollectionTask = await renderedCollections.findByLabelText('confirmColTaskAdd')

        await act(async () => {
            await user.type(inputCollectionTaskTaskTitle, "Test Collection Task")
            await user.type(inputCollectionTaskDesc, "Test Collection Task Description")
            await user.click(createCollectionTask)
        })

        const collectionTasks = await renderedCollections.findAllByTestId(/^colTask/);
        const newColTaskTitle = await renderedCollections.findByLabelText('colTaskTitle1')
        
        expect(collectionTasks.length).toEqual(1)
        expect(newColTaskTitle.innerHTML).toEqual("Test Collection Task");
    })

    test('Testing creating a task in a collection with tasks', async () => {
        const mockData1 = [{collectionTitle: "Mock Collection", collectionDescription: "Fake description", _id: 1, tasks: []},
        {collectionTitle: "Mock Collection 2", collectionDescription: "Fake description 2", _id: 2, tasks: [{title: "test", description: "test", _id: 1, status: "Incomplete"}]},
        {collectionTitle: "Mock Collection 3", collectionDescription: "Fake description 3", _id: 3, tasks: []}]

        window.localStorage.setItem("localCollectionData", JSON.stringify(mockData1))
        const renderedCollections = render(
        <MemoryRouter>
            <Collections data={JSON.stringify(mockData1)} isLogged={userLogin} updateCollection={updateCollection}/>
            <Routes>
                <Route path="/collections/:collectionID" element={<CollectionTasks data={JSON.stringify(mockData1)} isLogged={userLogin} updateCollection={updateCollection}/>}/>
            </Routes>
        </MemoryRouter>)

        const collectionTitle2 = await renderedCollections.findByLabelText("collectionTitle2")
        await act(async () => {
            await user.click(collectionTitle2)
        })

        const inputCollectionTaskTaskTitle = await renderedCollections.findByLabelText('addColTaskTitle')
        const inputCollectionTaskDesc = await renderedCollections.findByLabelText('addColTaskDesc')
        const createCollectionTask = await renderedCollections.findByLabelText('confirmColTaskAdd')

        await act(async () => {
            await user.type(inputCollectionTaskTaskTitle, "Test Collection Task")
            await user.type(inputCollectionTaskDesc, "Test Collection Task Description")
            await user.click(createCollectionTask)
        })

        const collectionTasks = await renderedCollections.findAllByTestId(/^colTask/);
        const oldColTaskTitle = await renderedCollections.findByLabelText('colTaskTitle1')
        const newColTaskTitle = await renderedCollections.findByLabelText('colTaskTitle2')
        
        expect(collectionTasks.length).toEqual(2)
        expect(oldColTaskTitle.innerHTML).toEqual("test");
        expect(newColTaskTitle.innerHTML).toEqual("Test Collection Task");
    })

    test('Testing deleting a task in a collection', async () => {
        const mockData1 = [{collectionTitle: "Mock Collection", collectionDescription: "Fake description", _id: 1, tasks: []},
        {collectionTitle: "Mock Collection 2", collectionDescription: "Fake description 2", _id: 2, tasks: [{title: "test", description: "test", _id: 1, status: "Incomplete"},
            {title: "test 2", description: "test 2", _id: 2, status: "Incomplete"}, {title: "Test title 3", description: "test 3", _id: 3, status: "Incomplete"}]},
        {collectionTitle: "Mock Collection 3", collectionDescription: "Fake description 3", _id: 3, tasks: []}]

        window.localStorage.setItem("localCollectionData", JSON.stringify(mockData1))
        const renderedCollections = render(
        <MemoryRouter>
            <Collections data={JSON.stringify(mockData1)} isLogged={userLogin} updateCollection={updateCollection}/>
            <Routes>
                <Route path="/collections/:collectionID" element={<CollectionTasks data={JSON.stringify(mockData1)} isLogged={userLogin} updateCollection={updateCollection}/>}/>
            </Routes>
        </MemoryRouter>)

        const collectionTitle2 = await renderedCollections.findByLabelText("collectionTitle2")
        await act(async () => {
            await user.click(collectionTitle2)
        })

        const deleteCollectionTaskBtn2 = await renderedCollections.findByLabelText('delColTaskBtn2')
        
        await act(async () => {
            await user.click(deleteCollectionTaskBtn2)
        })

        const collectionTasks = await renderedCollections.findAllByTestId(/^colTask/);
        const oldColTaskTitle = await renderedCollections.findByLabelText('colTaskTitle1')
        const newColTaskTitle = await renderedCollections.findByLabelText('colTaskTitle3')
        
        expect(collectionTasks.length).toEqual(2)
        expect(await renderedCollections.queryByLabelText("colTaskTitle2")).toEqual(null)
        expect(oldColTaskTitle.innerHTML).toEqual("test");
        expect(newColTaskTitle.innerHTML).toEqual("Test title 3");
    })

    test('Deleting a collection with tasks', async () => {
        const mockData1 = [{collectionTitle: "Mock Collection", collectionDescription: "Fake description", _id: 1, tasks: []},
        {collectionTitle: "Mock Collection 2", collectionDescription: "Fake description 2", _id: 2, tasks: [{title: "test", description: "test", _id: 1, status: "Incomplete"}]},
        {collectionTitle: "Mock Collection 3", collectionDescription: "Fake description 3", _id: 3, tasks: []}]

        window.localStorage.setItem("localCollectionData", JSON.stringify(mockData1))
        const renderedCollections = render(
        <MemoryRouter>
            <Collections data={JSON.stringify(mockData1)} isLogged={userLogin} updateCollection={updateCollection}/>
            <Routes>
                <Route path="/collections/:collectionID" element={<CollectionTasks data={JSON.stringify(mockData1)} isLogged={userLogin} updateCollection={updateCollection}/>}/>
            </Routes>
        </MemoryRouter>)

        const deleteCollectionBtn2 = await renderedCollections.findByLabelText('delCollection2')
        
        await act(async () => {
            await user.click(deleteCollectionBtn2)
        })

        const collectionTitle2 = await renderedCollections.findByLabelText("collectionTitle1")
        const collectionDesc2 = await renderedCollections.findByLabelText("collectionDesc1")
        const collectionTitle3 = await renderedCollections.findByLabelText("collectionTitle3")
        const collectionDesc3 = await renderedCollections.findByLabelText("collectionDesc3")

        const collections = await renderedCollections.findAllByTestId(/^collection/);

        expect(collections.length).toEqual(2)
        expect(await renderedCollections.queryByLabelText("collectionTitle2")).toEqual(null)
        expect(await renderedCollections.queryByLabelText("collectionDesc2")).toEqual(null)
        expect(collectionTitle2.textContent).toEqual("Mock Collection")
        expect(collectionDesc2.innerHTML).toEqual("Fake description")
        expect(collectionTitle3.textContent).toEqual("Mock Collection 3")
        expect(collectionDesc3.innerHTML).toEqual("Fake description 3")
    })

    test('Updating a collection task', async () => {
        const mockData1 = [{collectionTitle: "Mock Collection", collectionDescription: "Fake description", _id: 1, tasks: []},
        {collectionTitle: "Mock Collection 2", collectionDescription: "Fake description 2", _id: 2, tasks: [{title: "test", description: "test", _id: 1, status: "Incomplete"}]},
        {collectionTitle: "Mock Collection 3", collectionDescription: "Fake description 3", _id: 3, tasks: []}]

        window.localStorage.setItem("localCollectionData", JSON.stringify(mockData1))
        const renderedCollections = render(
        <MemoryRouter>
            <Collections data={JSON.stringify(mockData1)} isLogged={userLogin} updateCollection={updateCollection}/>
            <Routes>
                <Route path="/collections/:collectionID" element={<CollectionTasks data={JSON.stringify(mockData1)} isLogged={userLogin} updateCollection={updateCollection}/>}/>
            </Routes>
        </MemoryRouter>)

        const collectionTitle2 = await renderedCollections.findByLabelText("collectionTitle2")
        await act(async () => {
            await user.click(collectionTitle2)
        })

        const collectionTaskTitle = await renderedCollections.findByLabelText("colTaskTitle1")

        expect(collectionTaskTitle.innerHTML).toEqual("test")

        const updateCollectionTaskTitle = await renderedCollections.findByLabelText('editColTaskTitle1')
        const updateCollectionTaskDesc = await renderedCollections.findByLabelText('editColTaskDesc1')
        const updateCollectionTaskBtn = await renderedCollections.findByLabelText('confirmColTaskEdit1')

        await act(async () => {
            await user.type(updateCollectionTaskTitle, "Updated Test Collection Task")
            await user.type(updateCollectionTaskDesc, "Updated Collection Task Description")
            await user.click(updateCollectionTaskBtn)
        })

        const collectionTasks = await renderedCollections.findAllByTestId(/^colTask/);
        const newColTaskTitle = await renderedCollections.findByLabelText('colTaskTitle1')

        expect(collectionTasks.length).toEqual(1);
        expect(newColTaskTitle.innerHTML).toEqual("Updated Test Collection Task")
        expect(updateCollectionTaskTitle.value).toEqual("")
        expect(updateCollectionTaskDesc.value).toEqual("")
    })
})

describe('Tests for collections Page API', () => {

    const userLogin = true;
    const updateCollection = () => {}

    const mockCollectionDB = [{collections: [{collectionTitle: "mockCollection1",
        collectionDescription: "fake collection response 1", collectionStatus: "Incomplete", _id: 1, tasks: []},
        {collectionTitle: "mockCollection2", collectionDescription: "fake collection response 2",
            collectionStatus: "Incomplete", _id: 2, tasks: []}]},
        {collections: [{collectionTitle: "mockCollection1", collectionDescription: "fake collection response 1",
            collectionStatus: "Incomplete", _id: 1, tasks: []}]},
        {collections: []},
        {collections: [{collectionTitle: "mockCollection1 user4", collectionDescription: "fake collection response 1",
            collectionStatus: "Incomplete", _id: 1, tasks: []},
        {collectionTitle: "mockCollection2 user4", collectionDescription: "fake collection response 2",
            collectionStatus: "Incomplete", _id: 2, tasks: []}]},]

    afterEach(() => {localStorage.clear()})


    test('Testing fetching collections and tasks', async () => {
        window.localStorage.setItem("userId", 1);
        const response = await fetch(`http://localhost:8080/collections/${localStorage.getItem("userId")}`)
        expect(await response.json()).toEqual(mockCollectionDB[0].collections)
    })

    test.skip('Testing creating a task in a collection', async () => {

    })

    test.skip('Testing deleting a task in a collection', async () => {

    })

    test.skip('Deleting a collection with tasks', async () => {

    })

    test.skip('Updating a collection task', async () => {

    })

})
