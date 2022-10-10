import * as React from 'react';
import { Redirect} from 'react-router-dom';

export default class Home extends React.Component {
    render() {
        return (
            <React.Fragment>
                {!this.props.isLoggedIn && this.renderLogInRedirect()}
                <h1>Welcome Agent  ͡° ͜ʖ ͡°</h1>
            </React.Fragment>
        );
    }
    renderLogInRedirect(){
        return(
            <React.Fragment>
                <Redirect to='/login' />
            </React.Fragment>
        );
    }
}