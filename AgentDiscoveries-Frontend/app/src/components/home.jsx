import * as React from 'react';
import { Redirect} from 'react-router-dom';
import { apiGet } from './utilities/request-helper';
import { currentDateTimeEULondon} from './utilities/user-helper';
//import {apiGet} from '../utilities/request-helper';

export default class Home extends React.Component {

    // renderResultBody(result) {
    //     return Object.keys(result).map(key => {
    //         return <p key={key} id={key}>{`${key}: ${result[key]}`}</p>;
    //     });
    // }


    constructor(props) {
        super(props);
        this.state = {
            currentDateTimeEULondon: currentDateTimeEULondon(),
            timeZones: [],
        };
    }
    componentDidMount(){
        apiGet('locations')
            .then(reults => filterLocations(results))
            .catch(() => this.addMessage('Error fetching timezones, please try again later'));
    }
    filterLocations(results){
        results.array.forEach(result => {
            if (!timeZones.contains(result)){
                timeZones.push(result);
            }
        })
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