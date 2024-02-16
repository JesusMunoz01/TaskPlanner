import React, { useState as useStateReal} from 'react'
import { render, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import user from '@testing-library/user-event'
import { Group } from '../pages/group'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { UserContext } from '../App'
import { Groups } from '../pages/groups'
import useGroupData  from '../hooks/useGroupData'

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

jest.mock('../hooks/useGroupData', () => {
    return jest.fn().mockReturnValue({
      deleteGroup: jest.fn(),
      sendInvite: jest.fn(),
      leaveGroup: jest.fn(),
      editGroup: jest.fn(),
    });
  });

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
            useLocationMock.mockRestore()
    })

    test('Testing for member features (Leave button)', async () => {
        const mockData = {invites: ["testGroup"], joined: [{_id: 1, groupName: 'Test Group', groupDescription: 'Test Description', permissions: 'Member',
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
            const editGroupBtn = renderedGroup.queryByLabelText('editGroup')
            const deleteGroupBtn = renderedGroup.queryByLabelText('delGroup')
            const leaveGroupBtn = renderedGroup.getByLabelText('leaveGroup')
            const invText = renderedGroup.getByLabelText('inviteTitletestGroup')
    
            expect(groupText).toBeInTheDocument()
            expect(createCollectionBtn).toBeInTheDocument()
            expect(editGroupBtn).not.toBeInTheDocument()
            expect(deleteGroupBtn).not.toBeInTheDocument()
            expect(leaveGroupBtn).toBeInTheDocument()
            expect(invText).toBeInTheDocument()
            useLocationMock.mockRestore()
    })

    test('Test editing a group', async () => {
        let mockData = {invites: ["testGroup"], joined: [{_id: 1, groupName: 'Test Group', groupDescription: 'Test Description', permissions: 'Admin',
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

            await act(async () => {
                await user.click(editGroupBtn)
            })

            const editGroupForm = renderedGroup.getByLabelText('editForm')
            expect(editGroupForm).toBeInTheDocument()

            const groupName = renderedGroup.getByLabelText('updtGroupName')
            const groupDesc = renderedGroup.getByLabelText('updtGroupDesc')
            const saveBtn = renderedGroup.getByLabelText('saveGroup')
            const cancelBtn = renderedGroup.getByLabelText('cancelEdit')

            await act(async () => {
                await user.type(groupName, 'Test Group Updated')
                await user.type(groupDesc, 'Test Description Updated')
                await user.click(saveBtn)
                await user.click(linkBtn)
            })

            const updtGroupText = renderedGroup.getByLabelText('Test Group Updated-Header')

            expect(groupText).toBeInTheDocument()
            expect(createCollectionBtn).toBeInTheDocument()
            expect(editGroupBtn).toBeInTheDocument()
            expect(deleteGroupBtn).toBeInTheDocument()
            expect(invText).toBeInTheDocument()
            expect(groupName.value).toEqual("")
            expect(groupDesc.value).toEqual("")
            expect(updtGroupText).toHaveTextContent('Test Group Updated')
            useLocationMock.mockRestore()

    })

    test('Test deleting a group', async () => {
        let mockData = {invites: ["testGroup"], joined: [{_id: 1, groupName: 'Test Group', groupDescription: 'Test Description', permissions: 'Admin',
        collections: []}, {_id: 2, groupName: 'Test Group 2', groupDescription: 'Test Description 2', permissions: 'Member', collections: []}]}
        const setGroupData = newData => {mockData = newData};

        const useLocationMock = jest.spyOn(require('react-router-dom'), 'useLocation');
        useLocationMock.mockReturnValue({state: {from: mockData.joined[0], index: 0}})
        const useNavigateMock = jest.spyOn(require('react-router-dom'), 'useNavigate');
        useNavigateMock.mockReturnValue(jest.fn());

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

            const deleteGroupBtn = renderedGroup.getByLabelText('delGroup')

            await act(async () => {
                await user.click(deleteGroupBtn)
            })

            const delGroupForm = renderedGroup.getByLabelText('delActionTitle')
            expect(delGroupForm.innerHTML).toEqual("Delete Group")

            const confirmBtn = renderedGroup.getByLabelText('delActionConfirm')
            const cancelBtn = renderedGroup.getByLabelText('delActionCancel')

            await act(async () => {
                await user.click(confirmBtn)
            })

            expect(useNavigateMock).toHaveBeenCalled()

    })

    test('Test leaving a group', async () => {
        let mockData = {invites: ["testGroup"], joined: [{_id: 1, groupName: 'Test Group', groupDescription: 'Test Description', permissions: 'Member',
        collections: []}, {_id: 2, groupName: 'Test Group 2', groupDescription: 'Test Description 2', permissions: 'Member', collections: []}]}
        const setGroupData = newData => {mockData = newData};

        const useLocationMock = jest.spyOn(require('react-router-dom'), 'useLocation');
        useLocationMock.mockReturnValue({state: {from: mockData.joined[0], index: 0}})

        const useNavigateMock = jest.spyOn(require('react-router-dom'), 'useNavigate');
        useNavigateMock.mockReturnValue(jest.fn());

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
    
            const leaveGroupBtn = renderedGroup.getByLabelText('leaveGroup')

            await act(async () => {
                await user.click(leaveGroupBtn)
            })

            const confirmBtn = renderedGroup.getByLabelText('delActionConfirm')

            await act(async () => {
                await user.click(confirmBtn)
            })

            expect(useNavigateMock).toHaveBeenCalled()

            useLocationMock.mockRestore()
    })

    test('Test inviting a user to a group', async () => {
        const { sendInvite } = useGroupData();
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
    
            const invText = renderedGroup.getByLabelText('invUser')
            const invBtn = renderedGroup.getByLabelText('invUserBtn')

            await act(async () => {
                await user.type(invText, 'testUser')
                await user.click(invBtn)
            })
    
            expect(sendInvite).toHaveBeenCalled()

            useLocationMock.mockRestore()
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