import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuth } from './pages/login';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (isAuth() ? <Component {...props} /> :  
    <Redirect to="/login" />)} />                         
)


export default PrivateRoute;