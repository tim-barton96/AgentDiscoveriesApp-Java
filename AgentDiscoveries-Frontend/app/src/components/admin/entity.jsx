import React from 'react';
import {Button} from 'react-bootstrap';
import Link from 'react-router-dom/Link';

export default class Entity extends React.Component {
    constructor (props) {
        super(props);

        // Assume that the first JSON property is the ID property
        this.id = Object.values(props.entity)[0];
    }

    render() {
        return (
            <tr key={this.id}>
                {this.getEntityRow()}
                <td key='edit'>
                    {this.getEditButton()}
                </td>
            </tr>
        );
    }

    getEntityRow() {
        return this.props.getTableHeaders(this.props.type)
            .map(key =>
                <td key={key}>{this.props.entity[key]?this.props.entity[key].toString():'-'}</td>);
    }

    getEditButton() {
        return (
            <Link to={`/admin/${this.props.type}/edit/${this.id}`}>
                <Button type='button'>Edit</Button>
            </Link>
        );
    }
}
