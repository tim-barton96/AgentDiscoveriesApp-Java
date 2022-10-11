import * as React from 'react';
import {Panel} from 'react-bootstrap';

export default class SearchResult extends React.Component {
    render() {
        return (
            <div className='results'>
                {this.getResultsHeader(this.props.results)}
                {this.renderResults(this.props.results)}
            </div>
        );
    }

    renderResults(results) {
        return results.map((result, reportId) => {
            return (
                <Panel key={reportId}>
                    <Panel.Heading>Result</Panel.Heading>
                    <Panel.Body>{this.renderResultBody(result)}</Panel.Body>
                </Panel>
            );
        });
    }

    // renderResultBody(result) {
    //     return Object.keys(result).map(key => {
    //         return <p key={key} id={key}>{`${key}: ${result[key]}`}</p>;
    //     });
    // }

    renderResultBody(result) {
        return (
            <React.Fragment>
                <div className='meta-info-container'>
                    <p>Title: {result.reportTitle} </p>
                    <p>Agent: {result.agentId}</p>
                    <p>Status: {result.status}</p>
                    <p className='time'>Date: {result.reportTime}</p>
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
