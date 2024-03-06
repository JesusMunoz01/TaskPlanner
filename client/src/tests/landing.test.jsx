import '@testing-library/jest-dom'
import { render, cleanup, act } from '@testing-library/react'
import user from '@testing-library/user-event'
import { Landing } from '../pages/landing'

describe('Landing Page', () => {

    test('Testing component display', async () => {
        const renderedLanding = render(<Landing />)
        const links = await renderedLanding.findAllByRole('link')
        const taskLinkTitle = await renderedLanding.findByText('Basic Task Planner')
        const collectionsLinkTitle = await renderedLanding.findByText('Task Collections')
        const groupsLinkTitle = await renderedLanding.findByText('Groups')

        expect(taskLinkTitle).toBeInTheDocument()
        expect(collectionsLinkTitle).toBeInTheDocument()
        expect(groupsLinkTitle).toBeInTheDocument()
        expect(links.length).toEqual(3)

    })

    test.skip('Testing Tasks Link', async () => {
            
    })

    test.skip('Testing Collections Link', async () => {
            
    })

    test.skip('Testing Groups Link', async () => {
            
    })

})