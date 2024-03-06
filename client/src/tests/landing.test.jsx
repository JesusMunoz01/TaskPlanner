import '@testing-library/jest-dom'
import { render, act } from '@testing-library/react'
import user from '@testing-library/user-event'
import { Landing } from '../pages/landing'
import { UserContext } from '../App'
import { BrowserRouter as Router } from 'react-router-dom'
import { Navbar } from '../components/navbar'

describe('Landing Page', () => {

    beforeAll(() => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            })),
        });
    });

    test('Testing component display', async () => {
        const renderedLanding = render(
            <UserContext.Provider value={{}}>
            <Router>
                <Landing/>
            </Router>
        </UserContext.Provider>)
        const header = await renderedLanding.findByLabelText("Task Planner-Header")
        const links = await renderedLanding.findAllByRole('link')
        const taskLinkTitle = await renderedLanding.findByLabelText('Basic Task Planner')
        const collectionsLinkTitle = await renderedLanding.findByLabelText('Task Collections')
        const groupsLinkTitle = await renderedLanding.findByLabelText('Groups')

        expect(header).toBeInTheDocument()
        expect(taskLinkTitle).toBeInTheDocument()
        expect(collectionsLinkTitle).toBeInTheDocument()
        expect(groupsLinkTitle).toBeInTheDocument()
        expect(links.length).toEqual(3)
    })

    test('Testing Tasks Link', async () => {

        const renderedLanding = render(
            <UserContext.Provider value={{}}>
                <Router>
                    <Navbar/>
                    <Landing/>
                </Router>
            </UserContext.Provider>
            );
    
        const taskLink = await renderedLanding.findByLabelText('Basic Task Planner');
    
        await act(async () => {
            await user.click(taskLink);
        });

        const taskRoute = window.sessionStorage.getItem("selectedRoute")
        const route = window.location.pathname

        expect(route).toEqual('/tasks')
        expect(taskRoute).toEqual('Tasks')

    })

    test('Testing Collections Link', async () => {
        const renderedLanding = render(
            <UserContext.Provider value={{}}>
                <Router>
                    <Navbar/>
                    <Landing/>
                </Router>
            </UserContext.Provider>
            );
    
        const collectionsLink = await renderedLanding.findByLabelText('Task Collections');
    
        await act(async () => {
            await user.click(collectionsLink);
        });

        const collectionsRoute = window.sessionStorage.getItem("selectedRoute")
        const route = window.location.pathname

        expect(route).toEqual('/collections')
        expect(collectionsRoute).toEqual('Collections')
    })

    test('Testing Groups Link', async () => {
        const renderedLanding = render(
            <UserContext.Provider value={{}}>
                <Router>
                    <Navbar/>
                    <Landing/>
                </Router>
            </UserContext.Provider>
            );
    
        const groupsLink = await renderedLanding.findByLabelText('Groups');
    
        await act(async () => {
            await user.click(groupsLink);
        });

        const groupsRoute = window.sessionStorage.getItem("selectedRoute")
        const route = window.location.pathname

        expect(route).toEqual('/groups')
        expect(groupsRoute).toEqual('Groups')
    })

})