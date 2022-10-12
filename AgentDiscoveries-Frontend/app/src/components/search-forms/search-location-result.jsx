import * as React from 'react';
import {Panel, Button} from 'react-bootstrap';
import moment from 'moment';

export default class SearchLocationResult extends React.Component {
    render() {
        return (
            <div className='results'>
                {this.getResultsHeader(this.props.results)}
                {this.renderResults(this.props.results)}
            </div>
        );
    }

    renderResults(results) {
        return results.map((result) => {
            const date = moment(result.reportTime).format('DD/mm/YYYY');
            return (
                <Panel key={result.reportId}>
                    <Panel.Heading>
                        <p>Status Report {result.reportId} - {date}</p>
                        <Button variant="outline-primary">PDF</Button>
                    </Panel.Heading>
                    <Panel.Body>{this.renderResultBody(result)}</Panel.Body>
                </Panel>
            );
        });
    }

    renderResultBody(result) {
        const time = moment(result.reportTime).format('LT');
        
        return (
            <React.Fragment>
                <div className='meta-info-container'>
                    <p>Title: {result.reportTitle} </p>
                    <p>Agent: {result.agentId}</p>
                    <p>Status: {result.status}</p>
                    <p>Time: {time}</p>
                </div>
                <p>{result.reportBody}</p>
            </React.Fragment>
        );
    }

    getResultsHeader(results) {
        return results.length > 0
            ? (results.length === 1
                ? <h3>{`${results.length} result`}</h3>
                : <h3>{`${results.length} results`}</h3>)
            : '';
    }
}
