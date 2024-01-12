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
    const mockData = [{collectionTitle: "Mock Collection", collectionDescription: "Fake description", _id: 1, tasks: []}]

    test('Testing page with no collection data', async () => {
        const renderedCollections = render(<Collections />)
        
        expect(await renderedCollections.queryByLabelText(/^delCollection/)).not.toBeInTheDocument()
    })

    test('Testing page with collection data', async () => {
        const renderedCollections = render(<MemoryRouter><Collections data={JSON.stringify(mockData)} isLogged={userLogin} updateCollection={updateCollection}/></MemoryRouter>)

        const collections = await renderedCollections.findAllByTestId(/^collection/);

        expect(collections.length).toEqual(1);
    })

    test('Testing creating a collection with no previous collections', async () => {
        const renderedCollections = render(<MemoryRouter><Collections isLogged={userLogin} updateCollection={updateCollection}/></MemoryRouter>)
        const inputCollectionCollectionTitle = await renderedCollections.findByLabelText('addCollectionTitle')
        const inputCollectionDesc = await renderedCollections.findByLabelText('addCollectionDesc')
        const createCollection = await renderedCollections.findByLabelText('createNewCollection')

        await act(async () => {
            await user.type(inputCollectionCollectionTitle, "Test Collection")
            await user.type(inputCollectionDesc, "Test Description")
            await user.click(createCollection)
        })

        const collections = await renderedCollections.findAllByTestId(/^collection/);
        const collectionTitle = await renderedCollections.findByLabelText("collectionTitle0")

        expect(collections.length).toEqual(1);
        expect(collectionTitle.innerHTML).toEqual("Test Collection")
        expect(inputCollectionCollectionTitle.value).toEqual("")
        expect(inputCollectionDesc.value).toEqual("")
    })

    test('Testing creating a collection with previous collections', async () => {
        window.localStorage.setItem("localCollectionData", JSON.stringify(mockData))
        const renderedCollections = render(<MemoryRouter><Collections data={JSON.stringify(mockData)} isLogged={userLogin} updateCollection={updateCollection}/></MemoryRouter>)
        const inputCollectionCollectionTitle = await renderedCollections.findByLabelText('addCollectionTitle')
        const inputCollectionDesc = await renderedCollections.findByLabelText('addCollectionDesc')
        const createCollection = await renderedCollections.findByLabelText('createNewCollection')

        await act(async () => {
            await user.type(inputCollectionCollectionTitle, "Second Collection")
            await user.type(inputCollectionDesc, "The Second Test Description")
            await user.click(createCollection)
        })

        const collections = await renderedCollections.findAllByTestId(/^collection/);
        const prevCollectionTitle = await renderedCollections.findByLabelText("collectionTitle1")
        const newCollectionTitle = await renderedCollections.findByLabelText("collectionTitle2")

        expect(collections.length).toEqual(2);
        expect(prevCollectionTitle.innerHTML).toEqual("Mock Collection")
        expect(newCollectionTitle.innerHTML).toEqual("Second Collection")
        expect(inputCollectionCollectionTitle.value).toEqual("")
        expect(inputCollectionDesc.value).toEqual("")
    })

    test('Updating a collection', async () => {
        window.localStorage.setItem("localCollectionData", JSON.stringify(mockData))
        const renderedCollections = render(<MemoryRouter><Collections data={JSON.stringify(mockData)} isLogged={userLogin} updateCollection={updateCollection}/></MemoryRouter>)
        const updateCollectionTitle = await renderedCollections.findByLabelText('editCollectionTitle1')
        const updateCollectionDesc = await renderedCollections.findByLabelText('editCollectionDesc1')
        const cupdateCollection = await renderedCollections.findByLabelText('confirmColEdit1')

        await act(async () => {
            await user.type(updateCollectionTitle, "Updated Mock Collection")
            await user.type(updateCollectionDesc, "Updated Mock Description")
            await user.click(cupdateCollection)
        })

        const collections = await renderedCollections.findAllByTestId(/^collection/);
        const prevCollectionTitle = await renderedCollections.findByLabelText("collectionTitle1")

        expect(collections.length).toEqual(1);
        expect(prevCollectionTitle.innerHTML).toEqual("Updated Mock Collection")
        expect(updateCollectionTitle.value).toEqual("")
        expect(updateCollectionDesc.value).toEqual("")
    })

    test('Creating a collection and updating it', async () => {
        window.localStorage.removeItem("localCollectionData")
        const renderedCollections = render(<MemoryRouter><Collections isLogged={userLogin} updateCollection={updateCollection}/></MemoryRouter>)
        const inputCollectionTitle = await renderedCollections.findByLabelText('addCollectionTitle')
        const inputCollectionDesc = await renderedCollections.findByLabelText('addCollectionDesc')
        const createCollection = await renderedCollections.findByLabelText('createNewCollection')

        await act(async () => {
            await user.type(inputCollectionTitle, "Test Collection")
            await user.type(inputCollectionDesc, "Test Description")
            await user.click(createCollection)
        })

        const collectionTitle = await renderedCollections.findByLabelText("collectionTitle0")
        const collectionDesc = await renderedCollections.findByLabelText("collectionDesc0")

        expect(collectionTitle.innerHTML).toEqual("Test Collection")
        expect(collectionDesc.innerHTML).toEqual("Test Description")

        const updateCollectionTitle = await renderedCollections.findByLabelText('editCollectionTitle0')
        const updateCollectionDesc = await renderedCollections.findByLabelText('editCollectionDesc0')
        const updateCollectionBtn = await renderedCollections.findByLabelText('confirmColEdit0')

        await act(async () => {
            await user.type(updateCollectionTitle, "Updated Test Collection")
            await user.type(updateCollectionDesc, "Updated Test Description")
            await user.click(updateCollectionBtn)
        })

        const collections = await renderedCollections.findAllByTestId(/^collection/);
        const updatedCollectionTitle = await renderedCollections.findByLabelText("collectionTitle0")
        const updatedCollectionDesc = await renderedCollections.findByLabelText("collectionDesc0")

        expect(collections.length).toEqual(1);
        expect(updatedCollectionTitle.innerHTML).toEqual("Updated Test Collection")
        expect(updatedCollectionDesc.innerHTML).toEqual("Updated Test Description")
        expect(inputCollectionTitle.value).toEqual("")
        expect(inputCollectionDesc.value).toEqual("")
        expect(updateCollectionTitle.value).toEqual("")
        expect(updateCollectionDesc.value).toEqual("")
    })

    test('Testing creating and deleting a collection', async () => {
        window.localStorage.removeItem("localCollectionData")
        const renderedCollections = render(<MemoryRouter><Collections isLogged={userLogin} updateCollection={updateCollection}/></MemoryRouter>)
        const inputCollectionTitle = await renderedCollections.findByLabelText('addCollectionTitle')
        const inputCollectionDesc = await renderedCollections.findByLabelText('addCollectionDesc')
        const createCollection = await renderedCollections.findByLabelText('createNewCollection')

        await act(async () => {
            await user.type(inputCollectionTitle, "Test Collection")
            await user.type(inputCollectionDesc, "Test Description")
            await user.click(createCollection)
        })

        const collectionTitle = await renderedCollections.findByLabelText("collectionTitle0")
        const collectionDesc = await renderedCollections.findByLabelText("collectionDesc0")

        expect(collectionTitle.innerHTML).toEqual("Test Collection")
        expect(collectionDesc.innerHTML).toEqual("Test Description")

        const deleteCollectionBtn = await renderedCollections.findByLabelText('delCollection0')
        
        await act(async () => {
            await user.click(deleteCollectionBtn)
        })

        expect(deleteCollectionBtn).not.toBeInTheDocument()
        expect(await renderedCollections.queryByLabelText("collectionTitle0")).not.toBeInTheDocument()
        expect(await renderedCollections.queryByLabelText("collectionDesc0")).not.toBeInTheDocument()
    })

    test('Testing deleting an old collection', async () => {
        window.localStorage.setItem("localCollectionData", JSON.stringify(mockData))
        const renderedCollections = render(<MemoryRouter><Collections data={JSON.stringify(mockData)} isLogged={userLogin} updateCollection={updateCollection}/></MemoryRouter>)

        const deleteCollectionBtn = await renderedCollections.findByLabelText('delCollection1')
        
        await act(async () => {
            await user.click(deleteCollectionBtn)
        })

        expect(deleteCollectionBtn).not.toBeInTheDocument()
        expect(await renderedCollections.queryByLabelText("collectionTitle1")).not.toBeInTheDocument()
        expect(await renderedCollections.queryByLabelText("collectionDesc1")).not.toBeInTheDocument()
    })

    test('Testing deleting an old collection with other collections', async () => {
        const mockData1 = [{collectionTitle: "Mock Collection", collectionDescription: "Fake description", _id: 1, tasks: []},
        {collectionTitle: "Mock Collection 2", collectionDescription: "Fake description 2", _id: 2, tasks: []},
        {collectionTitle: "Mock Collection 3", collectionDescription: "Fake description 3", _id: 3, tasks: []}]

        window.localStorage.setItem("localCollectionData", JSON.stringify(mockData1))
        const renderedCollections = render(<MemoryRouter><Collections data={JSON.stringify(mockData1)} isLogged={userLogin} updateCollection={updateCollection}/></MemoryRouter>)

        const deleteCollectionBtn1 = await renderedCollections.findByLabelText('delCollection1')
        
        await act(async () => {
            await user.click(deleteCollectionBtn1)
        })

        const collectionTitle2 = await renderedCollections.findByLabelText("collectionTitle2")
        const collectionDesc2 = await renderedCollections.findByLabelText("collectionDesc2")
        const collectionTitle3 = await renderedCollections.findByLabelText("collectionTitle3")
        const collectionDesc3 = await renderedCollections.findByLabelText("collectionDesc3")

        const collections = await renderedCollections.findAllByTestId(/^collection/);

        expect(collections.length).toEqual(2)
        expect(await renderedCollections.queryByLabelText("collectionTitle1")).toEqual(null)
        expect(await renderedCollections.queryByLabelText("collectionDesc1")).toEqual(null)
        expect(collectionTitle2.textContent).toEqual("Mock Collection 2")
        expect(collectionDesc2.innerHTML).toEqual("Fake description 2")
        expect(collectionTitle3.textContent).toEqual("Mock Collection 3")
        expect(collectionDesc3.innerHTML).toEqual("Fake description 3")
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

    test('Testing page with no collection data', async () => {
        window.localStorage.setItem("userId", 3);
        const response = await fetch(`http://localhost:8080/collections/${localStorage.getItem("userId")}`)
        expect(await response.json()).toEqual([])
    })

    test('Testing fetching collections and tasks', async () => {
        window.localStorage.setItem("userId", 1);
        const response = await fetch(`http://localhost:8080/collections/${localStorage.getItem("userId")}`)
        expect(await response.json()).toEqual(mockCollectionDB[0].collections)
    })

    test('Testing creating a collection on a user with previous collections', async () => {
        const userID = 1;
        const title = "New collection";
        const desc = "New description";
        const response = await fetch(`http://localhost:8080/collections/create`, {
            method: "POST", headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID,
                title,
                desc,
                status: "Incomplete"
                })
            });
        const addedCol = {collectionTitle: title, collectionDescription: desc, collectionStatus: "Incomplete",
                _id: 3, tasks: []}
       
        const updatedData = await response.json();
        expect(updatedData.length).toEqual(3)
        expect(updatedData).toEqual([...mockCollectionDB[0].collections, addedCol])
    })

    test('Testing creating a collection on a user without previous collections', async () => {
        const userID = 3;
        const title = "First collection";
        const desc = "First description";
        const response = await fetch(`http://localhost:8080/collections/create`, {
            method: "POST", headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID,
                title,
                desc,
                status: "Incomplete"
                })
            });
        const updatedData = await response.json();
        expect(updatedData.length).toEqual(1)
        expect(updatedData).toEqual([{collectionTitle: "First collection", collectionDescription: "First description", 
            collectionStatus: "Incomplete", _id: 0, tasks: []}])
    })

    test('Testing deleting a collection', async () => {
        const userID = 4;
        const collectionID = 1;
        const response = await fetch(`http://localhost:8080/collections/delete/${collectionID}`, {
            method: "DELETE", body: JSON.stringify({userID})
        });
        const updatedData = await response.json();
        expect(updatedData.length).toEqual(1)
        expect(updatedData).toEqual([{collectionTitle: "mockCollection2 user4", collectionDescription: "fake collection response 2",
        collectionStatus: "Incomplete", _id: 2, tasks: []}])
    })

    test('Testing deleting the last collection', async () => {
        const userID = 2;
        const collectionID = 1;
        const response = await fetch(`http://localhost:8080/collections/delete/${collectionID}`, {
            method: "DELETE", body: JSON.stringify({userID})
        });
        const updatedData = await response.json();
        expect(updatedData.length).toEqual(0)
        expect(updatedData).toEqual([])
    })

    test('Updating a collection', async () => {
        const userID = 2;
        const collectionID = 1;
        const newTitle = "updated mockCollection1"
        const newDesc = "updated fake collection response 1"
        const response = await fetch(`http://localhost:8080/collections/update`, {
            method: "POST", headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID,
                collectionID,
                newTitle,
                newDesc
                })
            });
        const updatedData = await response.json();
        expect(updatedData.length).toEqual(1)
        expect(updatedData).toEqual([{collectionTitle: "updated mockCollection1",
        collectionDescription: "updated fake collection response 1",
        collectionStatus: "Incomplete", _id: 1, tasks: []}])
    })

})
