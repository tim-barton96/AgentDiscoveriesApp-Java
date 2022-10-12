import * as React from 'react';
import { Redirect} from 'react-router-dom';
import { currentDateTimeEULondon} from './utilities/user-helper';

export default class Home extends React.Component {


    








    constructor(props) {
        super(props);
        this.state = {
            currentDateTimeEULondon: currentDateTimeEULondon(),
        };
    }
    render() {
        return (
            <React.Fragment>
                {!this.props.isLoggedIn && this.renderLogInRedirect()}
                {this.props.isAgent && this.renderAgentHome()}
                {this.props.isAdmin && this.renderAdminHome()}
                <h2>The Current time is:</h2>
                <h2>London: {this.state.currentDateTimeEULondon}</h2>
            </React.Fragment>
        );
    }
    renderAgentHome(){
        return(
            <React.Fragment>
                <h1>° ͜ʖ° Hello there Agent ° ͜ʖ°</h1>
            </React.Fragment>
        );
    }
    renderAdminHome(){
        return(
            <React.Fragment>
                <h1>Welcome bossman ~ ͜ʖ°</h1>
            </React.Fragment>
        );
    }
    renderLogInRedirect(){
        return(
            <React.Fragment>java -jar AgentDiscoveries-Backend/target/agentdiscoveries-backend-1.0-SNAPSHOT.jar
                <Redirect to='/login' />
            </React.Fragment>
        );
    }
}