import React from 'react'
import { render, screen, cleanup, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import user from '@testing-library/user-event'
import { Groups } from '../pages/groups'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'
import { UserContext } from '../App'

describe('Tests for the groups Page', () => {

    test('Testing user not logged', () => {
        const renderedGroup = render(
        <UserContext.Provider value={{groupData: [], setGroupData: () => {}}}>
            <Groups/>
        </UserContext.Provider>)

        const text = renderedGroup.getByText('You are currently not logged, to access this feature log in')

        expect(text).toBeInTheDocument()
    })

    test('Testing user logged with no groups and no invites', () => {
        const renderedGroup = render(
        <UserContext.Provider value={{groupData: [], setGroupData: () => {}}}>
            <Groups userData={{invites: [], joined: []}} isLogged={true}/>
        </UserContext.Provider>)

        const text = renderedGroup.getByText('Currently no groups')
        const invText = renderedGroup.getByText('No Invites')

        expect(text).toBeInTheDocument()
        expect(invText).toBeInTheDocument()
    })

    test('Testing user logged with one group and no invites', () => {
        const mockData = {invites: [], joined: [{_id: 1, groupName: 'Test Group', groupDescription: 'Test Description', permissions: 'Admin'}]}
        const renderedGroup = render(
            <UserContext.Provider value={{groupData: mockData, setGroupData: () => {}}}>
                <MemoryRouter>
                    <Groups userData={mockData} isLogged={true}/>
                    <Routes>
                        <Route path="/groups/:groupId" element={<div>Group Page</div>}/>
                    </Routes>
                </MemoryRouter>
            </UserContext.Provider>)
    
            const groupText = renderedGroup.getByLabelText('groupTitle1')
            const invText = renderedGroup.getByText('No Invites')
    
            expect(groupText).toBeInTheDocument()
            expect(invText).toBeInTheDocument()
    })

    test('Testing user logged with multiple groups and invites', () => {
        const mockData = {invites: ["testGroup"], joined: [{_id: 1, groupName: 'Test Group', groupDescription: 'Test Description', permissions: 'Admin'},
        {_id: 2, groupName: 'Test Group 2', groupDescription: 'Test Description 2', permissions: 'Member'}]}
        const renderedGroup = render(
            <UserContext.Provider value={{groupData: mockData, setGroupData: () => {}}}>
                <MemoryRouter>
                    <Groups userData={mockData} isLogged={true}/>
                    <Routes>
                        <Route path="/groups/:groupId" element={<div>Group Page</div>}/>
                    </Routes>
                </MemoryRouter>
            </UserContext.Provider>)
    
            const groupText = renderedGroup.getByLabelText('groupTitle1')
            const invText = renderedGroup.getByLabelText('inviteTitletestGroup')
    
            expect(groupText).toBeInTheDocument()
            expect(invText).toBeInTheDocument()
    })

    test.skip('Testing admin user extra features (Delete and invite options)', () => {
        const mockData = {invites: ["testGroup"], joined: [{_id: 1, groupName: 'Test Group', groupDescription: 'Test Description', permissions: 'Admin'},
        {_id: 2, groupName: 'Test Group 2', groupDescription: 'Test Description 2', permissions: 'Member'}]}
        const renderedGroup = render(
            <UserContext.Provider value={{groupData: mockData, setGroupData: () => {}}}>
                <MemoryRouter>
                    <Groups userData={mockData} isLogged={true}/>
                    <Routes>
                        <Route path="/groups/:groupId" element={<div>Group Page</div>}/>
                    </Routes>
                </MemoryRouter>
            </UserContext.Provider>)
    
            const groupText = renderedGroup.getByLabelText('groupTitle1')
            const invText = renderedGroup.getByLabelText('inviteTitletestGroup')
    
            expect(groupText).toBeInTheDocument()
            expect(invText).toBeInTheDocument()
    })

    test.skip('Test creating a group', () => {

    })

    test.skip('Test updating a group', () => {

    })

    test.skip('Test joining a group', () => {

    })

    test.skip('Test rejecting a group invite', () => {

    })

    test.skip('Test leaving a group', () => {

    })

    test.skip('Test moving to a group page', () => {

    })


})