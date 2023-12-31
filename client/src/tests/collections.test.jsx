import React from 'react'
import { render, screen, cleanup, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import user from '@testing-library/user-event'
import { Collections } from '../pages/collections'



describe('Tests for collections Page', () => {

    const userLogin = false;
    const updateCollection = () => {}
    const mockData = [{collectionTitle: "Mock Collection", collectionDescription: "Fake description", _id: 1, tasks: []}]

    test('Testing page with no collection data', async () => {
        const renderedCollections = render(<Collections />)
        
        expect(await renderedCollections.queryByLabelText(/^delCollection/)).not.toBeInTheDocument()
    })

    test('Testing page with collection data', async () => {
        const renderedCollections = render(<Collections data={JSON.stringify(mockData)} isLogged={userLogin} updateCollection={updateCollection}/>)

        const collections = await renderedCollections.findAllByTestId(/^collection/);

        expect(collections.length).toEqual(1);
    })

    test('Testing creating a collection with no previous collections', async () => {
        const renderedCollections = render(<Collections isLogged={userLogin} updateCollection={updateCollection}/>)
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
        const renderedCollections = render(<Collections data={JSON.stringify(mockData)} isLogged={userLogin} updateCollection={updateCollection}/>)
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

    test.skip('Updating a collection', async () => {

    })

    test.skip('Testing deleting a collection', async () => {

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

describe('Tests for collections Page API', () => {

    test.skip('Testing page with no collection data', async () => {

    })

    test.skip('Testing fetching collections and tasks', async () => {

    })

    test.skip('Testing creating a collection', async () => {

    })

    test.skip('Testing deleting a collection', async () => {

    })

    test.skip('Updating a collection', async () => {

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
