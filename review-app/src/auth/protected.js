import React from 'react';
import {Route, Redirect} from 'react-router-dom';

const ProtectedRouter = ({component,...rest}) => {
    var RenderComponents = component;
    let gotToken = JSON.parse(localStorage.getItem('auth'));
    return (
        <Route
            {...rest}
            render = {
                props => {
                    return gotToken !== null ? (<RenderComponents {...props}/>) : 
                    (<Redirect to ={{
                            pathname:'/login'
                        }}
                    />)
                }
            }
        />
    )

}
export default ProtectedRouter;
