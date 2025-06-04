import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import {
  RouterProvider,
  createRouter,
} from '@tanstack/react-router';
import { routeTree } from './routing/routeTree.js';
import { Provider } from 'react-redux';
import store from './store/store.js';


// NOTE - Tanstack Query [Configuration]
const queryClient = new QueryClient();
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    store
  }
});



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
