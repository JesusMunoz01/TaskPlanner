import React from 'react'
import { render, screen, cleanup, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import user from '@testing-library/user-event'
import { Collections } from '../pages/collections'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'
import { CollectionTasks } from '../pages/collectionsTasks'
import { UserContext } from '../App'

describe('Tests for collections Page', () => {

    let collectionData = JSON.stringify([])
    const setCollectionData = jest.fn();
    const userLogin = false;
    const updateCollection = () => {}
    const mockData = [{collectionTitle: "Mock Collection", collectionDescription: "Fake description", _id: 1, tasks: []}]

    test('Testing page with no collection data', async () => {
        const renderedCollections = render(
        <UserContext.Provider value={{collectionData, setCollectionData}}>
            <MemoryRouter>
                <Collections/>
            </MemoryRouter>
        </UserContext.Provider>)
        
        expect(await renderedCollections.queryByLabelText(/^delcollection/)).not.toBeInTheDocument()
    })

    test('Testing page with collection data', async () => {
        const collectionData = JSON.stringify(mockData)
        const renderedCollections = render(
        <UserContext.Provider value={{collectionData, setCollectionData}}>
            <MemoryRouter>
                <Collections data={JSON.stringify(mockData)} isLogged={userLogin} updateCollection={updateCollection}/>
            </MemoryRouter>
        </UserContext.Provider>
        )

        const collections = await renderedCollections.findAllByTestId(/^collection/);

        expect(collections.length).toEqual(1);
    })

    test('Testing creating a collection with no previous collections', async () => {
        let collectionData = JSON.stringify([])
        const renderedCollections = render(
        <UserContext.Provider value={{collectionData, setCollectionData}}>
            <MemoryRouter>
                <Collections isLogged={userLogin} updateCollection={updateCollection}/>
            </MemoryRouter>
        </UserContext.Provider>
        )
        const createBox = await renderedCollections.findByLabelText('createGroup')
        const inputCollectionCollectionTitle = await renderedCollections.findByLabelText('addCollectionsTitle')
        const inputCollectionDesc = await renderedCollections.findByLabelText('addCollectionsDesc')
        const createCollection = await renderedCollections.findByLabelText('createNewCollections')
        const closeCreate = await renderedCollections.findByLabelText('closeCreateIcon')

        await act(async () => {
            await user.click(createBox)
            await user.type(inputCollectionCollectionTitle, "Test Collection")
            await user.type(inputCollectionDesc, "Test Description")
            await user.click(createCollection)
            await user.click(closeCreate)
            expect(inputCollectionCollectionTitle.value).toEqual("")
        })

        const collections = await renderedCollections.findAllByTestId(/^collections/);
        const collectionTitle = await renderedCollections.findByLabelText("collectionsTitle0")

        expect(collections.length).toEqual(1);
        expect(collectionTitle.innerHTML).toEqual("Test Collection")
        expect(inputCollectionCollectionTitle.value).toEqual("")
        expect(inputCollectionDesc.value).toEqual("")
    })

    test('Testing creating a collection with previous collections', async () => {
        window.localStorage.setItem("localCollectionData", JSON.stringify(mockData))
        let collectionData = JSON.stringify(mockData)
        const renderedCollections = render(
        <UserContext.Provider value={{collectionData, setCollectionData}}>
            <MemoryRouter>
                <Collections data={JSON.stringify(mockData)} isLogged={userLogin} updateCollection={updateCollection}/>
            </MemoryRouter>
        </UserContext.Provider>
        )
        const inputCollectionCollectionTitle = await renderedCollections.findByLabelText('addCollectionsTitle')
        const inputCollectionDesc = await renderedCollections.findByLabelText('addCollectionsDesc')
        const createCollection = await renderedCollections.findByLabelText('createNewCollections')

        await act(async () => {
            await user.type(inputCollectionCollectionTitle, "Second Collection")
            await user.type(inputCollectionDesc, "The Second Test Description")
            await user.click(createCollection)
        })

        const collections = await renderedCollections.findAllByTestId(/^collection/);
        const prevCollectionTitle = await renderedCollections.findByLabelText("collectionsTitle1")
        const newCollectionTitle = await renderedCollections.findByLabelText("collectionsTitle2")

        expect(collections.length).toEqual(2);
        expect(prevCollectionTitle.innerHTML).toEqual("Mock Collection")
        expect(newCollectionTitle.innerHTML).toEqual("Second Collection")
        expect(inputCollectionCollectionTitle.value).toEqual("")
        expect(inputCollectionDesc.value).toEqual("")
    })

    
    test('Updating a collection', async () => {
        window.localStorage.setItem("localCollectionData", JSON.stringify(mockData))
        let collectionData = JSON.stringify(mockData)
        const renderedCollections = render(
        <UserContext.Provider value={{collectionData, setCollectionData}}>
            <MemoryRouter>
                <Collections data={JSON.stringify(mockData)} isLogged={userLogin} updateCollection={updateCollection}/>
            </MemoryRouter>
        </UserContext.Provider>)
        const updateCollectionTitle = await renderedCollections.findByLabelText('editcollectionsTitle1')
        const updateCollectionDesc = await renderedCollections.findByLabelText('editcollectionsDesc1')
        const cupdateCollection = await renderedCollections.findByLabelText('confirmcollectionsEdit1')
        
        await act(async () => {
            await user.type(updateCollectionTitle, "Updated Mock Collection")
            await user.type(updateCollectionDesc, "Updated Mock Description")
            await user.click(cupdateCollection)
        })
        
        const collections = await renderedCollections.findAllByTestId(/^collection/);
        const prevCollectionTitle = await renderedCollections.findByLabelText("collectionsTitle1")
        
        expect(collections.length).toEqual(1);
        expect(prevCollectionTitle.innerHTML).toEqual("Updated Mock Collection")
        expect(updateCollectionTitle.value).toEqual("")
        expect(updateCollectionDesc.value).toEqual("")
    })
    
    test('Creating a collection and updating it', async () => {
        window.localStorage.removeItem("localCollectionData")
        const renderedCollections = render(
        <UserContext.Provider value={{collectionData, setCollectionData}}>
            <MemoryRouter>
                <Collections isLogged={userLogin} updateCollection={updateCollection}/>
            </MemoryRouter>
        </UserContext.Provider>)
        const inputCollectionTitle = await renderedCollections.findByLabelText('addCollectionsTitle')
        const inputCollectionDesc = await renderedCollections.findByLabelText('addCollectionsDesc')
        const createCollection = await renderedCollections.findByLabelText('createNewCollections')
        
        await act(async () => {
            await user.type(inputCollectionTitle, "Test Collection")
            await user.type(inputCollectionDesc, "Test Description")
            await user.click(createCollection)
        })
        
        const collectionTitle = await renderedCollections.findByLabelText("collectionsTitle0")
        const collectionDesc = await renderedCollections.findByLabelText("collectionsDesc0")

        expect(collectionTitle.innerHTML).toEqual("Test Collection")
        expect(collectionDesc.innerHTML).toEqual("Test Description")

        const updateCollectionTitle = await renderedCollections.findByLabelText('editcollectionsTitle0')
        const updateCollectionDesc = await renderedCollections.findByLabelText('editcollectionsDesc0')
        const updateCollectionBtn = await renderedCollections.findByLabelText('confirmcollectionsEdit0')

        await act(async () => {
                await user.type(updateCollectionTitle, "Updated Test Collection")
                await user.type(updateCollectionDesc, "Updated Test Description")
                await user.click(updateCollectionBtn)
            })
    
        const collections = await renderedCollections.findAllByTestId(/^collection/);
        const updatedCollectionTitle = await renderedCollections.findByLabelText("collectionsTitle0")
        const updatedCollectionDesc = await renderedCollections.findByLabelText("collectionsDesc0")

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
            const renderedCollections = render(
            <UserContext.Provider value={{collectionData, setCollectionData}}>
                <MemoryRouter>
                    <Collections isLogged={userLogin} updateCollection={updateCollection}/>
                </MemoryRouter>
            </UserContext.Provider>)
        const inputCollectionTitle = await renderedCollections.findByLabelText('addCollectionsTitle')
        const inputCollectionDesc = await renderedCollections.findByLabelText('addCollectionsDesc')
        const createCollection = await renderedCollections.findByLabelText('createNewCollections')
        
        await act(async () => {
            await user.type(inputCollectionTitle, "Test Collection")
            await user.type(inputCollectionDesc, "Test Description")
            await user.click(createCollection)
        })
        
        const collectionTitle = await renderedCollections.findByLabelText("collectionsTitle0")
        const collectionDesc = await renderedCollections.findByLabelText("collectionsDesc0")
        
        expect(collectionTitle.innerHTML).toEqual("Test Collection")
        expect(collectionDesc.innerHTML).toEqual("Test Description")
        
        const deleteCollectionBtn = await renderedCollections.findByLabelText('delcollections0')
        
        await act(async () => {
            await user.click(deleteCollectionBtn)
        })
        
        expect(deleteCollectionBtn).not.toBeInTheDocument()
        expect(await renderedCollections.queryByLabelText("collectionsTitle0")).not.toBeInTheDocument()
        expect(await renderedCollections.queryByLabelText("collectionsDesc0")).not.toBeInTheDocument()
    })
    
    test('Testing deleting an old collection', async () => {
        window.localStorage.setItem("localCollectionData", JSON.stringify(mockData))
        const collectionData = JSON.stringify(mockData)
        const renderedCollections = render(
            <UserContext.Provider value={{collectionData, setCollectionData}}>
                <MemoryRouter>
                    <Collections data={JSON.stringify(mockData)} isLogged={userLogin} updateCollection={updateCollection}/>
                </MemoryRouter>
            </UserContext.Provider>)

        const deleteCollectionBtn = await renderedCollections.findByLabelText('delcollections1')

        await act(async () => {
            await user.click(deleteCollectionBtn)
        })

        expect(deleteCollectionBtn).not.toBeInTheDocument()
        expect(await renderedCollections.queryByLabelText("collectionsTitle1")).not.toBeInTheDocument()
        expect(await renderedCollections.queryByLabelText("collectionsDesc1")).not.toBeInTheDocument()
    })

    test('Testing deleting an old collection with other collections', async () => {
        const mockData1 = [{collectionTitle: "Mock Collection", collectionDescription: "Fake description", _id: 1, tasks: []},
        {collectionTitle: "Mock Collection 2", collectionDescription: "Fake description 2", _id: 2, tasks: []},
        {collectionTitle: "Mock Collection 3", collectionDescription: "Fake description 3", _id: 3, tasks: []}]

        window.localStorage.setItem("localCollectionData", JSON.stringify(mockData1))
        const collectionData = JSON.stringify(mockData1)
        const setCollectionData = () => {}
        const renderedCollections = render(
        <UserContext.Provider value={{collectionData, setCollectionData}}>
            <MemoryRouter>
                <Collections data={JSON.stringify(mockData1)} isLogged={userLogin} updateCollection={updateCollection}/>
            </MemoryRouter>
        </UserContext.Provider>)

        const deleteCollectionBtn1 = await renderedCollections.findByLabelText('delcollections1')
        
        await act(async () => {
            await user.click(deleteCollectionBtn1)
        })

        const collectionTitle2 = await renderedCollections.findByLabelText("collectionsTitle2")
        const collectionDesc2 = await renderedCollections.findByLabelText("collectionsDesc2")
        const collectionTitle3 = await renderedCollections.findByLabelText("collectionsTitle3")
        const collectionDesc3 = await renderedCollections.findByLabelText("collectionsDesc3")

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
        const collectionData = JSON.stringify(mockData1)
        const setCollectionData = () => {}
        const renderedCollections = render(
        <UserContext.Provider value={{collectionData, setCollectionData}}>
        <MemoryRouter>
            <Collections data={JSON.stringify(mockData1)} isLogged={userLogin} updateCollection={updateCollection}/>
            <Routes>
                <Route path='/' element={null}/>
                <Route path="/collections/:collectionID" element={<CollectionTasks data={JSON.stringify(mockData1)} isLogged={userLogin} updateCollection={updateCollection}/>}/>
            </Routes>
        </MemoryRouter>
        </UserContext.Provider>)

        const deleteCollectionBtn2 = await renderedCollections.findByLabelText('delcollections2')
        
        await act(async () => {
            await user.click(deleteCollectionBtn2)
        })

        const collectionTitle2 = await renderedCollections.findByLabelText("collectionsTitle1")
        const collectionDesc2 = await renderedCollections.findByLabelText("collectionsDesc1")
        const collectionTitle3 = await renderedCollections.findByLabelText("collectionsTitle3")
        const collectionDesc3 = await renderedCollections.findByLabelText("collectionsDesc3")

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

// describe('Tests for collections Page API', () => {

//     const userLogin = true;
//     const updateCollection = () => {}

//     const mockCollectionDB = [{collections: [{collectionTitle: "mockCollection1",
//         collectionDescription: "fake collection response 1", collectionStatus: "Incomplete", _id: 1, tasks: []},
//         {collectionTitle: "mockCollection2", collectionDescription: "fake collection response 2",
//             collectionStatus: "Incomplete", _id: 2, tasks: []}]},
//         {collections: [{collectionTitle: "mockCollection1", collectionDescription: "fake collection response 1",
//             collectionStatus: "Incomplete", _id: 1, tasks: []}]},
//         {collections: []},
//         {collections: [{collectionTitle: "mockCollection1 user4", collectionDescription: "fake collection response 1",
//             collectionStatus: "Incomplete", _id: 1, tasks: []},
//         {collectionTitle: "mockCollection2 user4", collectionDescription: "fake collection response 2",
//             collectionStatus: "Incomplete", _id: 2, tasks: []}]},]

//     afterEach(() => {localStorage.clear()})

//     test('Testing page with no collection data', async () => {
//         window.localStorage.setItem("userId", 3);
//         const response = await fetch(`http://localhost:8080/collections/${localStorage.getItem("userId")}`)
//         expect(await response.json()).toEqual([])
//     })

//     test('Testing fetching collections and tasks', async () => {
//         window.localStorage.setItem("userId", 1);
//         const response = await fetch(`http://localhost:8080/collections/${localStorage.getItem("userId")}`)
//         expect(await response.json()).toEqual(mockCollectionDB[0].collections)
//     })

//     test('Testing creating a collection on a user with previous collections', async () => {
//         const userID = 1;
//         const title = "New collection";
//         const desc = "New description";
//         const response = await fetch(`http://localhost:8080/collections/create`, {
//             method: "POST", headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 userID,
//                 title,
//                 desc,
//                 status: "Incomplete"
//                 })
//             });
//         const addedCol = {collectionTitle: title, collectionDescription: desc, collectionStatus: "Incomplete",
//                 _id: 3, tasks: []}
       
//         const updatedData = await response.json();
//         expect(updatedData.length).toEqual(3)
//         expect(updatedData).toEqual([...mockCollectionDB[0].collections, addedCol])
//     })

//     test('Testing creating a collection on a user without previous collections', async () => {
//         const userID = 3;
//         const title = "First collection";
//         const desc = "First description";
//         const response = await fetch(`http://localhost:8080/collections/create`, {
//             method: "POST", headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 userID,
//                 title,
//                 desc,
//                 status: "Incomplete"
//                 })
//             });
//         const updatedData = await response.json();
//         expect(updatedData.length).toEqual(1)
//         expect(updatedData).toEqual([{collectionTitle: "First collection", collectionDescription: "First description", 
//             collectionStatus: "Incomplete", _id: 0, tasks: []}])
//     })

//     test('Testing deleting a collection', async () => {
//         const userID = 4;
//         const collectionID = 1;
//         const response = await fetch(`http://localhost:8080/collections/delete/${collectionID}`, {
//             method: "DELETE", body: JSON.stringify({userID})
//         });
//         const updatedData = await response.json();
//         expect(updatedData.length).toEqual(1)
//         expect(updatedData).toEqual([{collectionTitle: "mockCollection2 user4", collectionDescription: "fake collection response 2",
//         collectionStatus: "Incomplete", _id: 2, tasks: []}])
//     })

//     test('Testing deleting the last collection', async () => {
//         const userID = 2;
//         const collectionID = 1;
//         const response = await fetch(`http://localhost:8080/collections/delete/${collectionID}`, {
//             method: "DELETE", body: JSON.stringify({userID})
//         });
//         const updatedData = await response.json();
//         expect(updatedData.length).toEqual(0)
//         expect(updatedData).toEqual([])
//     })

//     test('Updating a collection', async () => {
//         const userID = 2;
//         const collectionID = 1;
//         const newTitle = "updated mockCollection1"
//         const newDesc = "updated fake collection response 1"
//         const response = await fetch(`http://localhost:8080/collections/update`, {
//             method: "POST", headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 userID,
//                 collectionID,
//                 newTitle,
//                 newDesc
//                 })
//             });
//         const updatedData = await response.json();
//         expect(updatedData.length).toEqual(1)
//         expect(updatedData).toEqual([{collectionTitle: "updated mockCollection1",
//         collectionDescription: "updated fake collection response 1",
//         collectionStatus: "Incomplete", _id: 1, tasks: []}])
//     })

// })
