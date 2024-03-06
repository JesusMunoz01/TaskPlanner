import '@testing-library/jest-dom'
import { render, cleanup, act } from '@testing-library/react'
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
        const links = await renderedLanding.findAllByRole('link')
        const taskLinkTitle = await renderedLanding.findByText('Basic Task Planner')
        const collectionsLinkTitle = await renderedLanding.findByText('Task Collections')
        const groupsLinkTitle = await renderedLanding.findByText('Groups')

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
    
        const taskLink = await renderedLanding.findByText('Basic Task Planner');
    
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
    
        const collectionsLink = await renderedLanding.findByText('Task Collections');
    
        await act(async () => {
            await user.click(collectionsLink);
        });

        const collectionsRoute = window.sessionStorage.getItem("selectedRoute")
        const route = window.location.pathname

        expect(route).toEqual('/collections')
        expect(collectionsRoute).toEqual('Collections')
    })

    test.skip('Testing Groups Link', async () => {
            
    })

})