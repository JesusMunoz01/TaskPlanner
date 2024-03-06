import '@testing-library/jest-dom'
import { render, cleanup, act } from '@testing-library/react'
import user from '@testing-library/user-event'
import { Landing } from '../pages/landing'
import { UserContext } from '../App'
import { MemoryRouter } from 'react-router-dom'

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
            <MemoryRouter>
                <Landing/>
            </MemoryRouter>
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
            <MemoryRouter>
                <Landing/>
            </MemoryRouter>
        </UserContext.Provider>)
        const taskLink = await renderedLanding.findByText('Basic Task Planner')
        user.click(taskLink)
        expect(window.location.pathname).toEqual('/')
    })

    test.skip('Testing Collections Link', async () => {
            
    })

    test.skip('Testing Groups Link', async () => {
            
    })

})