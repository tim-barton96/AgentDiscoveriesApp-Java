import * as React from 'react';
import { Redirect} from 'react-router-dom';
import { apiGet } from './utilities/request-helper';
import {currentDateTimeEULondon} from './utilities/user-helper';


export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDateTimeEULondon: currentDateTimeEULondon(),
            timeZones: [],
            locations: [],
        };
        this.filterLocations = this.filterLocations.bind(this);
    }
    componentDidMount(){
        apiGet('locations')
            .then(results => this.filterLocations(results))
            .catch(() => console.log('error'));
    }
    filterLocations(results){
        results.forEach(result => {
            if (!this.state.timeZones.includes(result.timeZone)){
                this.setState({timeZones:[...this.state.timeZones,result.timeZone]});
                this.setState({locations:[...this.state.locations,result.location]});
            }
        });
    }
    render() {
        return (
            <React.Fragment>
                {!this.props.isLoggedIn && this.renderLogInRedirect()}
                {this.props.isAgent && this.renderAgentHome()}
                {this.props.isAdmin && this.renderAdminHome()}
                <h2>The Current time in your location is: {this.state.currentDateTimeEULondon}</h2>
                <h3>{this.state.locations}{this.renderTimeZones(this.state.timeZones)}</h3>
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
    renderTimeZones(results){
        return <div> 
            {results.map((result) => {
                const date = new Date().toLocaleString('en-GB',{timeZone: result});
                return (
                    <p key={result}>{date}</p>
                );
            })
            }</div>;
    }
}