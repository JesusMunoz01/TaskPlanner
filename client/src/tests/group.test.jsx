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

    test.skip('Testing for admin features (Delete, Edit, and invite buttons)', () => {
        const mockData = {invites: ["testGroup"], joined: [{_id: 1, groupName: 'Test Group', groupDescription: 'Test Description', permissions: 'Admin'},
        {_id: 2, groupName: 'Test Group 2', groupDescription: 'Test Description 2', permissions: 'Member'}]}
        const renderedGroup = render(
            <UserContext.Provider value={{groupData: mockData, setGroupData: () => {}}}>
                <MemoryRouter>
                    <Groups userData={mockData} isLogged={true}/>
                    <Routes>
                        <Route path='/' element={null}/>    
                        <Route path="/groups/:groupId" element={<div>Group Page</div>}/>
                    </Routes>
                </MemoryRouter>
            </UserContext.Provider>)
    
            const groupText = renderedGroup.getByLabelText('groupTitle1')
            const invText = renderedGroup.getByLabelText('inviteTitletestGroup')
    
            expect(groupText).toBeInTheDocument()
            expect(invText).toBeInTheDocument()
    })

    test.skip('Test editing a group', () => {
        
    })

    test.skip('Test deleting a group', () => {
        
    })

    test.skip('Test leaving a group', () => {
        
    })

    test.skip('Test updating a group', () => {

    })

    test.skip('Test inviting a user to a group', () => {
            
    })

    test.skip('Test creating a group collection', () => {
            
    })

    test.skip('Test creating a group collection', () => {
            
    })

    test.skip('Test editing a group collection', () => {
            
    })

    test.skip('Test deleting a group collection', () => {
            
    })

})

describe('Tests for the group Page API ', () => {
            
    test.skip('Test API for editing a group', () => {
        
    })

    test.skip('Test API for deleting a group', () => {
        
    })

    test.skip('Test API for leaving a group', () => {
        
    })

    test.skip('Test API for updating a group', () => {

    })

    test.skip('Test API for inviting a user to a group', () => {
            
    })

    test.skip('Test API for creating a group collection', () => {
            
    })

    test.skip('Test API for creating a group collection', () => {
            
    })

    test.skip('Test API for editing a group collection', () => {
            
    })

    test.skip('Test API for deleting a group collection', () => {
            
    })

})