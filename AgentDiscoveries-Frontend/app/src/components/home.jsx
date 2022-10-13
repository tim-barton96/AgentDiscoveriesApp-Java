import * as React from 'react';
import { Redirect} from 'react-router-dom';
import { apiGet } from './utilities/request-helper';
import { currentDateTimeEULondon} from './utilities/user-helper';


export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDateTimeEULondon: currentDateTimeEULondon(),
            timeZones: [],
        };
    }
    componentDidMount(){
        apiGet('locations')
            .then(results => this.filterLocations(results))
            .catch(() => this.addMessage('Error fetching timezones, please try again later'));
    }
    filterLocations(results){
        results.array.forEach(result => {
            if (!this.state.timeZones.contains(result)){
                this.setState({timeZones:[...this.state.timeZones,result]});
       
            }
        });
    }
    render() {
        return (
            <React.Fragment>
                {!this.props.isLoggedIn && this.renderLogInRedirect()}
                {this.props.isAgent && this.renderAgentHome()}
                {this.props.isAdmin && this.renderAdminHome()}
                <h2>The Current time is:</h2>
                {this.renderTimeZones(this.state.results)}
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
        return results.map((result) => {
            const date = new Date().toLocaleString('en-GB',{timeZone: result});
            return (
                <p key={result}>
                    {date}
                </p>
            );
        });
    }
}