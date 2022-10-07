import * as React from 'react';
import {Button, ControlLabel, Form, FormControl, FormGroup} from 'react-bootstrap';
import {apiGet, apiPost, apiPut} from '../utilities/request-helper';
import Message from '../message';

export default class LocationForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            siteName: '',
            location: '',
            timeZone: '',
            regionId: '',
            longitude: '',
            latitude: '',
            longValid: false,
            latValid: false,
            // siteValid: false,
            locationValid: false,
            timeZoneValid: false,
            formValid: false,

            formErrors: {lat: '', lon: '', site: '', location: '', timeZone: ''},

            message: {}
        };

        this.onSiteChange = this.onSiteChange.bind(this);
        this.onLocationChange = this.onLocationChange.bind(this);
        this.onTimeZoneChange = this.onTimeZoneChange.bind(this);
        this.onRegionIdChange = this.onRegionIdChange.bind(this);
        this.onLatitudeChange = this.onLatitudeChange.bind(this);
        this.onLongitudeChange = this.onLongitudeChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);
        this.validateField = this.validateField.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.errorClass = this.errorClass.bind(this);
        

        // In edit mode, the ID of the location is passed in through props
        if (this.props.id) {
            this.loadLocation(this.props.id);
        }
    }

    render() {
        return (
            <div className='col-md-8 col-md-offset-2'>
                <Message message={this.state.message} />
                <div className='col-md-12'>
                    <Form onSubmit={this.onSubmit}>
                        <h3>{this.props.id ? 'Edit' : 'Create'} Location</h3>
                        <FormGroup>
                            <ControlLabel>Site Name</ControlLabel>
                            <FormControl type='text' required
                                name='siteName'
                                placeholder='Enter site name'
                                value={this.state.siteName}
                                onChange={this.onSiteChange}/>
                        </FormGroup>
                        <div className='col-md-12'>{this.state.formErrors.site}</div>
                        <FormGroup>
                            <ControlLabel>Location Name</ControlLabel>
                            <FormControl type='text' required
                                name='location'
                                placeholder='Enter location name'
                                value={this.state.location}
                                onChange={this.handleUserInput}/>
                        </FormGroup>
                        <div className='col-md-12'>{this.state.formErrors.location}</div>
                        <FormGroup>
                            <ControlLabel>Time Zone</ControlLabel>
                            <FormControl type='text' required
                                name='timeZone'
                                placeholder='Enter time zone (e.g. "Europe/London")'
                                value={this.state.timeZone}
                                onChange={this.handleUserInput}/>
                        </FormGroup>
                        <div className='col-md-12'>{this.state.formErrors.timeZone}</div>
                        <FormGroup>
                            <ControlLabel>Region</ControlLabel>
                            <FormControl type='number'
                                placeholder='Enter region ID (optional)'
                                value={this.state.regionId}
                                onChange={this.onRegionIdChange}/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Latitude</ControlLabel>
                            <FormControl type='number' required
                                className='form-control'
                                name='latitude'
                                placeholder='Enter latitude (Between -90 and 90)'
                                value={this.state.latitude}
                                onChange={this.handleUserInput}/>
                        </FormGroup>
                        <div className='col-md-12'>{this.state.formErrors.lat}</div>
                        <FormGroup>
                            <ControlLabel>Longitude</ControlLabel>
                            <FormControl type='number' required
                                name='longitude'
                                placeholder='Enter longitude (Between -180 and 180)'
                                value={this.state.longitude}
                                onChange={this.handleUserInput}/>
                        </FormGroup>
                        <div className='col-md-12'>{this.state.formErrors.lon}</div>
                        <Button type='submit' disabled={!this.state.formValid}>Submit</Button>
                    </Form>
                </div>
            </div>
        );
    }

    onSiteChange(event) {
        this.setState({ siteName: event.target.value });
    }

    onLocationChange(event) {
        this.setState({ location: event.target.value });
    }

    onTimeZoneChange(event) {
        this.setState({ timeZone: event.target.value });
    }

    onRegionIdChange(event) {
        this.setState({ regionId: parseInt(event.target.value) });
    }

    onLongitudeChange(event) {
        this.setState({ longitude: parseFloat(event.target.value) });
    }

    onLatitudeChange(event) {
        this.setState({ latitude: parseFloat(event.target.value) });
    }

    handleUserInput(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value},
            () => this.validateField(name, value));
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let longValid = this.state.longValid;
        let latValid = this.state.latValid;
        // let siteValid = this.state.siteValid;
        let locationValid = this.state.locationValid;
        let timeZoneValid = this.state.timeZoneValid;

        switch(fieldName) {
            // case 'siteName':
            //     siteValid = value.lenth > 0;
            //     fieldValidationErrors.site = siteValid ? '' : 'Site name connot be empty';
            //     break;
            case 'longitude':
                longValid = value.match(/^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,6})$/);
                fieldValidationErrors.lon = longValid ? '' : 'Longitude must be between -180 and 180 with at least 1 and up to 6 decimal places';
                break;
            case 'latitude':
                latValid = value.match(/^-?([0-8]?[0-9]|90)(\.[0-9]{1,6})$/);
                fieldValidationErrors.lat = latValid ? '' : 'Latitude must be between -90 and 90 with at least 1 and up to 6 decimal places';
                break;
            case 'location':
                locationValid = value.length > 0;
                fieldValidationErrors.location = locationValid ? '' : 'Location name cannot be empty';
                break;
            case 'timeZone':
                timeZoneValid = value.length > 0;
                fieldValidationErrors.timeZone = timeZoneValid ? '' : 'Time zone cannot be empty';
                break;
            default:
                break;
        }
        this.setState({message: fieldValidationErrors,
            longValid: longValid,
            latValid: latValid,
            locationValid: locationValid,
            // siteValid: siteValid,
            timeZoneValid: timeZoneValid},
        this.validateForm);
    }

    validateForm() {
        this.setState({formValid: this.state.longValid && this.state.latValid && this.state.locationValid && this.state.timeZoneValid});
    } // this.state.siteValid &&

    errorClass(error) {
        return(error.length === 0 ? '' : 'has-error');
    }
    
    onSubmit(event) {
        event.preventDefault();

        const body = {
            siteName: this.state.siteName,
            location: this.state.location,
            timeZone: this.state.timeZone,
            regionId: this.state.regionId ? this.state.regionId : null,
            longitude: this.state.longitude,
            latitude: this.state.latitude
        };

        const request = this.props.id
            ? apiPut('locations', body, this.props.id)
            : apiPost('locations', body);

        request
            .then(() => window.location.hash = '#/admin/locations')
            .catch(error => this.setState({ message: { message: error.message, type: 'danger' } }));
    }

    loadLocation(id) {
        apiGet('locations', id)
            .then(result => this.setState(result))
            .catch(error => this.setState({ message: { message: error.message, type: 'danger' } }));
    }
}
