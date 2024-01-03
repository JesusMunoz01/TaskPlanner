import React from 'react'
import { render, screen, cleanup, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import user from '@testing-library/user-event'
import App from '../App'
import { Login } from '../pages/login'
import Cookies from 'js-cookie'
import { Navbar } from '../components/navbar'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

const mockUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));

describe('Login Page', () => {

    afterEach(cleanup)

    test('Testing no data', async () => {
        const renderedHome = render(<Login loginStatus={false}/>)
        const loginName = await renderedHome.findByLabelText('loginAccount')
        const loginPassword = await renderedHome.findByLabelText('loginPassword')
        const createName = await renderedHome.findByLabelText('createAccount')
        const createPassword = await renderedHome.findByLabelText('createPassword')
        
        expect(loginName.value).toEqual("")
        expect(loginPassword.value).toEqual("")
        expect(createName.value).toEqual("")
        expect(createPassword.value).toEqual("")
    })

    test('Testing input on login and creation', async () => {
        const renderedHome = render(<Login loginStatus={false}/>)
        const loginName = await renderedHome.findByLabelText('loginAccount')
        const loginPassword = await renderedHome.findByLabelText('loginPassword')
        const createName = await renderedHome.findByLabelText('createAccount')
        const createPassword = await renderedHome.findByLabelText('createPassword')

        await act(async () => {
            await user.type(loginName, "Test User")
            await user.type(loginPassword, "Secret Password")
            await user.type(createName, "New User")
            await user.type(createPassword, "New Password")
        })
        
        expect(loginName.value).toEqual("Test User")
        expect(loginPassword.value).toEqual("Secret Password")
        expect(createName.value).toEqual("New User")
        expect(createPassword.value).toEqual("New Password")
    })

    test("Testing account creation API request with wrong password format", async () => {
        const newUsername = "Tester User 1";
        const newPassword = "Test";
        const response = await fetch(`http://localhost:8080/addUser`, {
            method: "POST", 
            body: JSON.stringify({
                newUsername,
                newPassword,
                })
            });
        const account = await response.json();
        expect(account).toEqual("Cant add user")
    })

    test("Testing account creation API request", async () => {
        const newUsername = "Tester User 1";
        const newPassword = "Tester Password 1!";
        const response = await fetch(`http://localhost:8080/addUser`, {
            method: "POST", 
            body: JSON.stringify({
                newUsername,
                newPassword,
                })
            });
        const account = await response.json();
        expect(account).toEqual({_id: 4,
            username: 'Tester User 1',
            password: 'Tester Password 1!',
            tasks: [],
            collections: []
          })
    })

    test("Testing login API request with account that was just created", async () => {
        const username = "Tester User 1";
        const password = "Tester Password 1!";
        const response = await fetch(`http://localhost:8080/userLogin`, {
            method: "POST",
            body: JSON.stringify({
                username,
                password,
                })
            });
        const login = await response.json();
        expect(login).toEqual({_id: 4,
            username: 'Tester User 1',
            password: 'Tester Password 1!',
            tasks: [],
            collections: []
          })

    })

    test("Testing login API request with an old account", async () => {
        const username = "TUser1";
        const password = "TPassword1!";
        const response = await fetch(`http://localhost:8080/userLogin`, {
            method: "POST",
            body: JSON.stringify({
                username,
                password,
                })
            });
        const login = await response.json();
        expect(login).toEqual({_id: 1,
            username: 'TUser1',
            password: 'TPassword1!',
            tasks: [{title: "mock1", description: "fake response 1", _id: 1},
                {title: "mock2", description: "fake response 2", _id: 2},
                {title: "mock3", description: "fake response 3", _id: 3}],
            collections: [{collectionTitle: "mockCollection1",
                collectionDescription: "fake collection response 1",
                collectionStatus: "Incomplete", tasks: []},
                {collectionTitle: "mockCollection2",
                collectionDescription: "fake collection response 2",
                collectionStatus: "Incomplete", tasks: []}]
          })
    })
})

describe('Testing Home page logout option', () => {

    test('Test to see if user is logged', async () => {
        Cookies.set("access_token", "secretCookie");
        localStorage.setItem("userId", 3);
        
        const renderedNav = render(<Router><Navbar /></Router>)
        const logoutText = await renderedNav.findByLabelText("loginLink")
        expect(logoutText.textContent).toEqual("Logout")
    })

    test('Test to see if user is not logged', async () => {
        Cookies.remove("access_token", "secretCookie");
        localStorage.setItem("userId", 3);
        const renderedNav = render(<Router><Navbar /></Router>)
        const logoutText = await renderedNav.findByLabelText("loginLink")
        expect(logoutText.textContent).toEqual("Login")
    })

})