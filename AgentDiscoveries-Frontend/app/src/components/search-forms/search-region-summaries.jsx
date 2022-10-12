import * as React from 'react';
import {Button, ControlLabel, Form, FormControl, FormGroup} from 'react-bootstrap';
import Message from '../message';
import SearchRegionResult from './search-region-result';
import moment from 'moment/moment';
import QueryString from 'query-string';
import {apiGet} from '../utilities/request-helper';

export default class RegionSummariesSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            regionId: '',
            agentId: '',
            fromTime: '',
            toTime: '',

            results: [],
            message: {},
            regions: [],
            agents: []
        };

        this.onRegionChange = this.onRegionChange.bind(this);
        this.onAgentChange = this.onAgentChange.bind(this);
        this.onFromChange = this.onFromChange.bind(this);
        this.onToChange = this.onToChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        apiGet('agents')
            .then(results => this.setState({ agents: results }))
            .catch(() => this.addMessage('Error fetching agents, please try again later', 'danger'));

        apiGet('regions')
            .then(results => this.setState({regions: results}))
            .catch(() => this.addMessage('Error fetching regions, please try again later'));
    }

    render() {
        return (
            <div className='col-md-8 col-md-offset-2'>
                <Form onSubmit={this.onSubmit}>
                    <h3>Search Region Summaries</h3>

                    <Message message={this.state.message} />

                    
                    <FormGroup>
                        <ControlLabel>Region</ControlLabel>
                        <FormControl componentClass='select' required
                            value={this.state.regionId}
                            onChange={this.onRegionChange}
                            id='region-select'>
                            <option value='' hidden>Choose an region</option>
                            {this.state.regions.map(region => 
                                <option key={region.regionId} value={region.regionId}>{region.name}</option>)}
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Agent</ControlLabel>
                        <FormControl componentClass='select' required
                            value={this.state.agentId}
                            onChange={this.onAgentChange}
                            id='agent-select'>
                            <option value='' hidden>Choose an agent</option>
                            {this.state.agents.map(agent => 
                                <option key={agent.agentId} value={agent.agentId}>{agent.agentId} {agent.callSign}</option>)}
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

                <SearchRegionResult results={this.state.results} />
            </div>
        );
    }

    onRegionChange(event) {
        this.setState({ regionId: parseInt(event.target.value) });
    }

    onAgentChange(event) {
        this.setState({ agentId: parseInt(event.target.value) });
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
            regionId: this.state.regionId,
            agentId: this.state.agentId,
            fromTime: this.state.fromTime && moment.utc(this.state.fromTime).startOf('day').toISOString(),
            toTime: this.state.toTime && moment.utc(this.state.toTime).endOf('day').toISOString()
        };

        const url = 'reports/regionsummaries?' + QueryString.stringify(params);

        apiGet(url)
            .then(results => this.setState({ results: results, message: {} }))
            .catch(error => this.setState({ message: { message: error.message, type: 'danger' } }));
    }
}
