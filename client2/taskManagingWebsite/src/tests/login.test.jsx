import React from 'react'
import { render, screen, cleanup, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import user from '@testing-library/user-event'
import App from '../App'
import { Login } from '../pages/login'
import Cookies from 'js-cookie'
import { Navbar } from '../components/navbar'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

/*
const mockDB = [{_id: 1, tasks: [{title: "mock1", description: "fake response 1", _id: 1},
          {title: "mock2", description: "fake response 2", _id: 2},
          {title: "mock3", description: "fake response 3", _id: 3}]
        },
                {_id: 2, tasks: [{title: "mock1", description: "fake response 1", _id: 1},
          {title: "mock2", description: "fake response 2", _id: 2},
          {title: "mock3", description: "fake response 3", _id: 3}]
        },
                {_id: 3, tasks: []
        }]
*/


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
})

describe('Testing Home page logout option', () => {
    beforeEach(() => {    
        const localStorageMock = (function () {
            let store = {};
        
            return {
            getItem(key) {
                return store[key];
            },
        
            setItem(key, value) {
                store[key] = value;
            },
        
            clear() {
                store = {};
            },
        
            removeItem(key) {
                delete store[key];
            },
        
            getAll() {
                return store;
            },
            };
      })();
      
      Object.defineProperty(window, "localStorage", { value: localStorageMock });

 })

    test('Test to see if user is logged', async () => {
        Cookies.set("access_token", "secretCookie");
        localStorage.setItem("userId", 3);
        
        const renderedNav = render(<Router><Navbar /></Router>)
        const logoutText = await renderedNav.findByLabelText("loginLink")
        expect(logoutText.textContent).toEqual("Logout")
    })

})