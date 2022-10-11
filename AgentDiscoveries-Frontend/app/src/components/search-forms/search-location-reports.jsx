import * as React from 'react';
import {Button, ControlLabel, Form, FormControl, FormGroup} from 'react-bootstrap';
import QueryString from 'query-string';
import moment from 'moment';
import Message from '../message';
import SearchResult from './search-result';
import {apiGet} from '../utilities/request-helper';

export default class LocationReportsSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            agentId: '',
            locationId: '',
            title: '',
            fromTime: '',
            toTime: '',

            results: [],
            message: {},
            agents: [],
            locations: []
        };

        this.onAgentIdChange = this.onAgentIdChange.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onLocationChange = this.onLocationChange.bind(this);
        this.onFromChange = this.onFromChange.bind(this);
        this.onToChange = this.onToChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        
    }

    componentDidMount() {
        apiGet('agents')
            .then(results => this.setState({ agents: results }))
            .catch(() => this.addMessage('Error fetching agents, please try again later', 'danger'));

        apiGet('locations')
            .then(results => this.setState({locations: results}))
            .catch(() => this.addMessage('Error fetching locations, please try again later', 'danger'));
    }


    render() {
        return (
            <div className='col-md-8 col-md-offset-2'>
                <Form onSubmit={this.onSubmit}>
                    <h3>Search Location Reports</h3>

                    <Message message={this.state.message} />
                    <FormGroup>
                        <ControlLabel>Agent</ControlLabel>
                        <FormControl componentClass='select' required
                            value={this.state.agent_id}
                            onChange={this.onAgentIdChange}
                            id='agent-select'>
                            <option value='' hidden>Choose an agent</option>
                            {this.state.agents.map(agent => 
                                <option key={agent.agentId} value={agent.agentId}>{agent.agentId} {agent.callSign}</option>)}
                        </FormControl>
                    </FormGroup>
                    
                    <FormGroup>
                        <ControlLabel>Title</ControlLabel>
                        <FormControl type='text'
                            placeholder='Enter title'
                            value={this.state.title}
                            onChange={this.onTitleChange}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Location</ControlLabel>
                        <FormControl componentClass='select' required
                            value={this.state.locationId}
                            onChange={this.onLocationChange}>
                            <option value='' hidden>Choose a location</option>
                            {this.state.locations.map(location =>
                                <option key={location.locationId} value={location.locationId}>{location.location} {location.siteName}</option>)}
                        </FormControl>
                    </FormGroup>
                    <FormGroup className='form-inline'>
                        <ControlLabel className='rm-3'>From</ControlLabel>
                        <FormControl className='rm-3' type='date'
                            value={this.state.fromTime}
                            onChange={this.onFromChange}/>

                        <ControlLabel className='rm-3'>To</ControlLabel>
                        <FormControl className='rm-3' type='date'
                            value={this.state.toTime}
                            onChange={this.onToChange}/>
                    </FormGroup>
                    <Button type='submit'>Search</Button>
                </Form>
                <SearchResult results={this.state.results} />
            </div>
        );
    }

    onAgentIdChange(event) {
        this.setState({ agentId: event.target.value });
    }
    onTitleChange(event){
        this.setState({ title: event.target.value });
    }
    onLocationChange(event) {
        this.setState({ locationId: parseInt(event.target.value) });
    }

    onFromChange(event) {
        this.setState({ fromTime: event.target.value });
    }

    onToChange(event) {
        this.setState({ toTime: event.target.value });
    }

    onSubmit(event) {
        event.preventDefault();

        const params = {
            agentId: this.state.agentId,
            title: this.state.title,
            locationId: this.state.locationId,
            fromTime: this.state.fromTime && moment.utc(this.state.fromTime).startOf('day').toISOString(),
            toTime: this.state.toTime && moment.utc(this.state.toTime).endOf('day').toISOString()
        };

        const url = 'reports/locationstatuses?' + QueryString.stringify(params);

        apiGet(url)
            .then(results => this.setState({ results: results, message: {} }))
            .catch(error => this.setState({ message: { message: error.message, type: 'danger' } }));
    }

}
