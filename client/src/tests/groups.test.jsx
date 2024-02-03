import React, { useState as useStateReal} from 'react'
import { render, screen, cleanup, act, getByText, queryByLabelText } from '@testing-library/react'
import '@testing-library/jest-dom'
import user from '@testing-library/user-event'
import { Groups } from '../pages/groups'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'
import { UserContext } from '../App'

describe('Tests for the groups Page', () => {

    global.AbortController = jest.fn(() => ({
        signal: 'mockSignal',
        abort: jest.fn(),
      }));

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
                        <Route path='/' element={null}/>
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

    test('Test creating a group with no groups fetch call', async () => {
        const fetchCopy = global.fetch;
        global.__API__ = 'http://localhost:8000'
        global.fetch = jest.fn()
        global.fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(
            {_id: 1, groupName: 'Test Group', groupDescription: 'Test Description', permissions: 'Admin'})}));

        let mockData = {invites: [], joined: []}
        const setGroupData = newData => {mockData = newData};
        localStorage.setItem('userId', 2)

        const {getByLabelText} = render(
            <UserContext.Provider value={{groupData: mockData, setGroupData}}>
                <MemoryRouter>
                    <Groups userData={mockData} isLogged={true}/>
                    <Routes>
                        <Route path='/' element={null}/>
                        <Route path="/groups/:groupId" element={<div>Group Page</div>}/>
                    </Routes>
                </MemoryRouter>
            </UserContext.Provider>)
    
        const groupTitle = getByLabelText('groupTitleNew')
        const groupDesc = getByLabelText('groupDescNew')
        const createBtn = getByLabelText('submitNewGroup')

        await act(async () => {
            await user.type(groupTitle, 'Test Group')
            await user.type(groupDesc, 'Test Description')
            await user.click(createBtn)
        })

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/groups/createGroup', 
            {"body": "{\"userID\":\"2\",\"title\":\"Test Group\",\"desc\":\"Test Description\"}", 
            "headers": {"Content-Type": "application/json", "auth": undefined}, "method": "POST"})

        const groupText = getByLabelText('groupTitle1')
        const groupDescText = getByLabelText('groupDesc1')

        expect(groupText.innerHTML).toEqual("Test Group")
        expect(groupDescText.innerHTML).toEqual("Test Description")

        global.fetch = fetchCopy
    })


    test('Test creating a group with groups fetch call', async () => {
        const mockData = {invites: ["testGroup"], joined: [{_id: 1, groupName: 'Test Group', groupDescription: 'Test Description', permissions: 'Admin'},
        {_id: 2, groupName: 'Test Group 2', groupDescription: 'Test Description 2', permissions: 'Member'}]}
        const setGroupData = newData => {mockData = newData};
        localStorage.setItem('userId', 2)

        const fetchCopy = global.fetch;
        global.__API__ = 'http://localhost:8000'
        global.fetch = jest.fn()
        global.fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(
            {_id: 3, groupName: 'Test Group 3', groupDescription: 'Test Description 3', permissions: 'Admin'}
        )}));

        const {getByLabelText} = render(
            <UserContext.Provider value={{groupData: mockData, setGroupData}}>
                <MemoryRouter>
                    <Groups userData={mockData} isLogged={true}/>
                    <Routes>
                        <Route path='/' element={null}/>
                        <Route path="/groups/:groupId" element={<div>Group Page</div>}/>
                    </Routes>
                </MemoryRouter>
            </UserContext.Provider>)
    
        const groupTitle = getByLabelText('groupTitleNew')
        const groupDesc = getByLabelText('groupDescNew')
        const createBtn = getByLabelText('submitNewGroup')

        await act(async () => {
            await user.type(groupTitle, 'Test Group')
            await user.type(groupDesc, 'Test Description')
            await user.click(createBtn)
        })

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/groups/createGroup', 
            {"body": "{\"userID\":\"2\",\"title\":\"Test Group\",\"desc\":\"Test Description\"}", 
            "headers": {"Content-Type": "application/json", "auth": undefined}, "method": "POST"})

        const groupText = getByLabelText('groupTitle1')
        const groupDescText = getByLabelText('groupDesc1')
        const groupText2 = getByLabelText('groupTitle2')
        const groupDescText2 = getByLabelText('groupDesc2')
        const groupText3 = getByLabelText('groupTitle3')
        const groupDescText3 = getByLabelText('groupDesc3')

        expect(groupText.innerHTML).toEqual("Test Group")
        expect(groupDescText.innerHTML).toEqual("Test Description")
        expect(groupText2.innerHTML).toEqual("Test Group 2")
        expect(groupDescText2.innerHTML).toEqual("Test Description 2")
        expect(groupText3.innerHTML).toEqual("Test Group 3")
        expect(groupDescText3.innerHTML).toEqual("Test Description 3")

        global.fetch = fetchCopy
    })

    
    test('Test joining a group', async () => {
        let mockData = {invites: ["testGroup", "Invite2"], joined: []}
        const setGroupData = newData => {mockData = newData};
        localStorage.setItem('userId', 2)

        const fetchCopy = global.fetch;
        global.__API__ = 'http://localhost:8000'
        global.fetch = jest.fn()
        global.fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(
            {groupName: "testGroup", groupDescription: "desc", 
            collections: [], _id: 1, permissions: "Member", invites: ["Invite2"]}
        )}));

        const {getByLabelText} = render(
            <UserContext.Provider value={{groupData: mockData, setGroupData}}>
                <MemoryRouter>
                    <Groups userData={mockData} isLogged={true}/>
                    <Routes>
                        <Route path='/' element={null}/>
                        <Route path="/groups/:groupId" element={<div>Group Page</div>}/>
                    </Routes>
                </MemoryRouter>
            </UserContext.Provider>)
    
        const acceptBtn = getByLabelText('acceptGroup0')

        await act(async () => {
            await user.click(acceptBtn)
        })

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/groups/testGroup/invite/action', 
            {"body": "{\"userID\":\"2\",\"action\":\"accept\"}", "headers": {"Content-Type": "application/json", "auth": undefined}, 
            "method": "POST", "signal": "mockSignal"})

        const groupText = getByLabelText('groupTitle1')
        const invText = getByLabelText('inviteTitleInvite2')

        expect(groupText.innerHTML).toEqual("testGroup")
        expect(invText.innerHTML).toEqual("Group: Invite2")
        global.fetch = fetchCopy
    })

    test('Test rejecting a group invite', async () => {
        let mockData = {invites: ["testGroup", "Invite2"], joined: []}
        const setGroupData = newData => {mockData = newData};
        localStorage.setItem('userId', 2)

        const fetchCopy = global.fetch;
        global.__API__ = 'http://localhost:8000'
        global.fetch = jest.fn()
        global.fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve({invites: ["Invite2"]})}));

        const {getByLabelText, queryByText} = render(
            <UserContext.Provider value={{groupData: mockData, setGroupData}}>
                <MemoryRouter>
                    <Groups userData={mockData} isLogged={true}/>
                    <Routes>
                        <Route path='/' element={null}/>
                        <Route path="/groups/:groupId" element={<div>Group Page</div>}/>
                    </Routes>
                </MemoryRouter>
            </UserContext.Provider>)
    
        const denyBtn = getByLabelText('denyGroup0')

        await act(async () => {
            await user.click(denyBtn)
        })

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/groups/testGroup/invite/action', 
            {"body": "{\"userID\":\"2\",\"action\":\"deny\"}", "headers": {"Content-Type": "application/json", "auth": undefined}, 
            "method": "POST", "signal": "mockSignal"})

        const groupText = queryByText('testGroup')
        const invText = getByLabelText('inviteTitleInvite2')

        expect(groupText).not.toBeInTheDocument()
        expect(invText.innerHTML).toEqual("Group: Invite2")
        global.fetch = fetchCopy
    })
    
    
    test.skip('Test moving to a group page', () => {
        
    })
    
    test.skip('Test leaving a group', () => {
        
    })

    test.skip('Test updating a group', () => {

    })
    
    test.skip('Testing admin user extra features (Delete and invite options)', () => {
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


})

describe('Tests for the groups Page API and response rendering', () => {
            
    test('Test creating a group API', async () => {
        const title = "Test Group";
        const desc = "Test Description";
        const userID = 2;
        const response = await fetch(`http://localhost:8080/groups/createGroup`, {
            method: "POST", headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID,
                title,
                desc,
                })
            });

        const data = await response.json()
        expect(data).toEqual({"_id": 2, "collections": [], "groups": {"invites": [], "joined": [{"_id": 1, "collections": [], "groupName": "Test Group", 
            "groupDescription": "Test Description", "permissions": "Admin"}]}, "password": "TPassword2!", "tasks": [], "username": "TUser2"})
    })

    test('Test joining a group API', async () => {
        const userID = 4;
        const action = "accept";
        const response = await fetch(`http://localhost:8080/groups/testInvite/invite/action`, {
            method: "POST", headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID,
                action
                })
            });

        const data = await response.json()
        expect(data).toEqual({invites: ["testInvite2"], joined: [{groupTitle: "mockGroup1", groupDescription: "fake group response 1", 
            groupStatus: "Incomplete", _id: 1, collections: [], permissions: "Admin"}, {groupTitle: "testInvite", groupStatus: "Incomplete", 
            groupDescription: "Fake invite group", _id: 10, collections: [], permissions: "Member"}]})
    })

    test('Test denying an invitation API', async () => {
        const userID = 3;
        const action = "deny";
        const response = await fetch(`http://localhost:8080/groups/testInvite/invite/action`, {
            method: "POST", headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID,
                action
                })
            });

        const data = await response.json()
        expect(data).toEqual({invites: ["testInvite2"], joined: []})
    })

})