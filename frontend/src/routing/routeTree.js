import { createRootRoute } from '@tanstack/react-router'
import App from '../App.jsx'
import {
    homeRoute,
    authRoute,
    dashboardRoute
} from './routing.js';


export const rootRoute = createRootRoute({ component: App })

export const routeTree = rootRoute.addChildren([
    homeRoute,
    authRoute,
    dashboardRoute
])