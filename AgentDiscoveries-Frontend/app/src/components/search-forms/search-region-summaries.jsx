import * as React from 'react';
import {Button, ControlLabel, Form, FormControl, FormGroup} from 'react-bootstrap';
import Message from '../message';
import SearchResult from './search-result';
import moment from 'moment/moment';
import QueryString from 'query-string';
import {apiGet} from '../utilities/request-helper';

export default class RegionSummariesSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            regionId: '',
            userId: '',
            fromTime: '',
            toTime: '',

            results: [],
            message: {},
            regions: [],
            users: []
        };

        this.onRegionChange = this.onRegionChange.bind(this);
        this.onUserChange = this.onUserChange.bind(this);
        this.onFromChange = this.onFromChange.bind(this);
        this.onToChange = this.onToChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        apiGet('users')
            .then(results => this.setState({ users: results }))
            .catch(() => this.addMessage('Error fetching users, please try again later', 'danger'));

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
                        <ControlLabel>User</ControlLabel>
                        <FormControl componentClass='select' required
                            value={this.state.userId}
                            onChange={this.onUserChange}
                            id='user-select'>
                            <option value='' hidden>Choose an user</option>
                            {this.state.users.map(user => 
                                <option key={user.userId} value={user.userId}>{user.userId} {user.username}</option>)}
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

    onRegionChange(event) {
        this.setState({ regionId: parseInt(event.target.value) });
    }

    onUserChange(event) {
        this.setState({ userId: parseInt(event.target.value) });
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
            userId: this.state.userId,
            fromTime: this.state.fromTime && moment.utc(this.state.fromTime).startOf('day').toISOString(),
            toTime: this.state.toTime && moment.utc(this.state.toTime).endOf('day').toISOString()
        };

        const url = 'reports/regionsummaries?' + QueryString.stringify(params);

        apiGet(url)
            .then(results => this.setState({ results: results, message: {} }))
            .catch(error => this.setState({ message: { message: error.message, type: 'danger' } }));
    }
}
