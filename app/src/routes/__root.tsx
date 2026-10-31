import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '#/components/Footer'
import Header from '#/components/Header'
import SmoothScroll from '#/components/SmoothScroll'
import { NotebookProvider } from '#/components/NotebookMargins'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Dramas of Discrimination',
      },
      {
        name: 'description',
        content: 'An anti-caste, open-source project of the Ambedkar Reading Circle. Communities rehearse equality and fraternity and write manifestos of inclusion.',
      },
    ],
  }),
  component: RootDocument,
})

function RootDocument() {
  return (
    <NotebookProvider>
      <SmoothScroll />
      <div className="site-shell">
        <Header />
        <Outlet />
        <Footer />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </div>
    </NotebookProvider>
  )
}
