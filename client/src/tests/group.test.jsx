import React, { useState as useStateReal} from 'react'
import { render, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import user from '@testing-library/user-event'
import { Group } from '../pages/group'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { UserContext } from '../App'

describe('Tests for the groups Page', () => {

    test.skip('Testing user not logged', () => {
        const renderedGroup = render(
        <UserContext.Provider value={{groupData: [], setGroupData: () => {}}}>
            <Group/>
        </UserContext.Provider>)

        const text = renderedGroup.getByText('You are currently not logged, to access this feature log in')

        expect(text).toBeInTheDocument()
    })

})

describe('Tests for the group Page API ', () => {
            
    test.skip('Test creating a collection', async () => {
    })

})