import * as React from 'react';
import {Button, ControlLabel, Form, FormControl, FormGroup} from 'react-bootstrap';
import {apiPost} from './utilities/request-helper';
import SHA256 from 'crypto-js/sha256';

export default class TodaysCodePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            password: '',
            result: ''
        };

        this.onMessageChange = this.onMessageChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.handleDecode = this.handleDecode.bind(this);
        this.handleEncode = this.handleEncode.bind(this);
        this.handleRequest = this.handleRequest.bind(this);
    }

    render() {
        return (
            <div className='col-md-8 col-md-offset-2'>
                <Form>

                    <h3>Encode/decode message with today's secret</h3>

                    <FormGroup>
                        <ControlLabel>Message</ControlLabel>
                        <FormControl type='text' required
                            id='message-input'
                            componentClass='textarea' rows={6}
                            placeholder='Enter message'
                            value={this.state.message}
                            onChange={this.onMessageChange}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Password</ControlLabel>
                        <FormControl type='password' required
                            id='password-input'
                            placeholder='Enter password'
                            value={this.state.password}
                            onChange={this.onPasswordChange}/>
                    </FormGroup>

                    <Button id="encode-button" className='rm-3' type='submit' onClick={this.handleEncode}>Encode</Button>
                    <Button id="decode-button" type='submit' onClick={this.handleDecode}>Decode</Button>
                </Form>


                <div id="code-result">
                    {this.state.result ? <h3>Result</h3> : ''}
                    {this.state.result ? <textarea value={this.state.result} rows='4' className='form-control' ></textarea> : ''}
                    {this.state.result ? <Form>
                        <Button className='rm-3' onClick={() =>  navigator.clipboard.writeText(this.state.result)} disabled={!this.state.result}>Copy result</Button>
                    </Form> : ''}
                </div>
                
            </div>

        );
    }

    onMessageChange(event) {
        this.setState({ message: event.target.value });
    }

    onPasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    handleEncode(event) {
        event.preventDefault();
        this.handleRequest('encodemessage');
    }

    handleDecode(event) {
        event.preventDefault();
        this.handleRequest('decodemessage');
    }

    handleRequest(api) {
        let shaHash = SHA256(this.state.password).toString();
        const body = { message: this.state.message,
            password: shaHash };

        apiPost(api, body)
            .then(response => this.setState({ result: response }))
            .catch(error => this.setState({ result: error.message }));
    }
}
