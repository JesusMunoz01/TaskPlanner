import React, { useState as useStateReal} from 'react'
import { render, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import user from '@testing-library/user-event'
import { Group } from '../pages/group'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { UserContext } from '../App'
import { Groups } from '../pages/groups'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useLocation: () => ({
        state: {from: {collections: []}, index: 0}
    }),
  }));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useNavigate: () => jest.fn(),
}));

describe('Tests for the groups Page', () => {

    test('Testing user not logged', () => {
        const useLocationMock = jest.spyOn(require('react-router-dom'), 'useLocation');
        useLocationMock.mockReturnValue({state: {from: {collections: []}, index: 0}})

        const renderedGroup = render(
        <UserContext.Provider value={{groupData: [], setGroupData: () => {}}}>
            <Groups/>
        </UserContext.Provider>)

        const text = renderedGroup.getByText('You are currently not logged, to access this feature log in')

        expect(text).toBeInTheDocument()
        useLocationMock.mockRestore()
    })

    test('Testing for admin features (Delete, Edit, and invite buttons)', async () => {
        const mockData = {invites: ["testGroup"], joined: [{_id: 1, groupName: 'Test Group', groupDescription: 'Test Description', permissions: 'Admin',
        collections: []}, {_id: 2, groupName: 'Test Group 2', groupDescription: 'Test Description 2', permissions: 'Member', collections: []}]}
        const setGroupData = newData => {mockData = newData};

        const useLocationMock = jest.spyOn(require('react-router-dom'), 'useLocation');
        useLocationMock.mockReturnValue({state: {from: mockData.joined[0], index: 0}})

        const renderedGroup = render(
            <UserContext.Provider value={{groupData: mockData, setGroupData}}>
                <MemoryRouter>
                    <Groups userData={mockData} isLogged={true}/>
                    <Routes>
                        <Route path='/' element={null}/>    
                        <Route path="/groups/:groupId" element={<Group />}/>
                    </Routes>
                </MemoryRouter>
            </UserContext.Provider>)

            const linkBtn = renderedGroup.getByLabelText('group1')

            await act(async () => {
                await user.click(linkBtn)
            })
    
            const groupText = renderedGroup.getByLabelText('Test Group-Header')
            const createCollectionBtn = renderedGroup.getByLabelText('createGroup')
            const editGroupBtn = renderedGroup.getByLabelText('editGroup')
            const deleteGroupBtn = renderedGroup.getByLabelText('delGroup')
            const invText = renderedGroup.getByLabelText('inviteTitletestGroup')
    
            expect(groupText).toBeInTheDocument()
            expect(createCollectionBtn).toBeInTheDocument()
            expect(editGroupBtn).toBeInTheDocument()
            expect(deleteGroupBtn).toBeInTheDocument()
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