import React from 'react'
import { render, screen, cleanup, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import user from '@testing-library/user-event'
import { Collections } from '../pages/collections'



describe('Tests for collections Page', () => {
    const userLogin = false;
    const updateCollection = () => {}
    test('Testing page with no collection data', async () => {
        const renderedCollections = render(<Collections />)
        
        expect(await renderedCollections.queryByLabelText(/^delCollection/)).not.toBeInTheDocument()
    })

    test('Testing page with collection data', async () => {
        const mockData = [{collectionTitle: "Mock Collection", collectionDescription: "Fake description", _id: 1, tasks: []}]

        const renderedCollections = render(<Collections data={JSON.stringify(mockData)} isLogged={userLogin} updateCollection={updateCollection}/>)

        const collections = await renderedCollections.findAllByTestId(/^collection/);

        expect(collections.length).toEqual(1);
    })

    test.skip('Testing creating a collection', async () => {

    })

    test.skip('Testing creating a task in a collection', async () => {

    })

    test.skip('Testing deleting a task in a collection', async () => {

    })

    test.skip('Testing deleting a collection', async () => {

    })

    test.skip('Deleting a collection with tasks', async () => {

    })

    test.skip('Updating a collection task', async () => {

    })

    test.skip('Updating a collection', async () => {

    })

})

describe('Tests for collections Page API', () => {

    test.skip('Testing page with no collection data', async () => {

    })

    test.skip('Testing fetching collections and tasks', async () => {

    })

    test.skip('Testing creating a collection', async () => {

    })

    test.skip('Testing creating a task in a collection', async () => {

    })

    test.skip('Testing deleting a task in a collection', async () => {

    })

    test.skip('Testing deleting a collection', async () => {

    })

    test.skip('Deleting a collection with tasks', async () => {

    })

    test.skip('Updating a collection task', async () => {

    })

    test.skip('Updating a collection', async () => {

    })

})
