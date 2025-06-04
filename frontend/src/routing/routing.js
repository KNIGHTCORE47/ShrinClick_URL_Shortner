import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "./routeTree.js"
import HomePage from '../pages/HomePage.jsx';
import AuthPage from '../pages/AuthPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import {
    isPublicRoute,
    isPrivateRoute
} from '../utils/private.js';


const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomePage,
})

const authRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auth',
    component: AuthPage,
    beforeLoad: isPublicRoute
})

const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/dashboard',
    component: DashboardPage,
    beforeLoad: isPrivateRoute
})


export {
    homeRoute,
    authRoute,
    dashboardRoute
}