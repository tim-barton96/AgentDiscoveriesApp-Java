import * as React from 'react';
import { Redirect} from 'react-router-dom';
import { currentDateTime } from './utilities/user-helper';

export default class Home extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            currentDateTime: currentDateTime(),
        };
    }
    render() {
        return (
            <React.Fragment>
                {!this.props.isLoggedIn && this.renderLogInRedirect()}
                <h1>Welcome Agent  ° ͜ʖ°</h1>
                <h2>{this.state.currentDateTime}</h2>
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