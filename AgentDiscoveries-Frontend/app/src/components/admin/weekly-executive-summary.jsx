import * as React from 'react';
// import {ControlLabel, FormControl, FormGroup} from 'react-bootstrap';
import { apiGet } from '../utilities/request-helper';


export default class WeeklyExecutiveSummary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            weeklyExecutiveSummaryUpdate: {},
            message: {}
        };

        // var today = new Date(),
        // date = today.getFullYear() + '-' + (today.getMonth() +1) + '-' + today.getDate();
        // getLastWeeksDate() { const now = new Date(); return new Date(now. getFullYear(), now. getMonth(), now. getDate() - 7); } 
    
        // this.onAgentNameUpdate = this.onUpdate.bind(this, 'agentName');
        // this.onNumberOfReportUpdate = this.onUpdate.bind(this, 'numberOfReport');
        // //this.onWeeklyExecutiveSummary = this.onUpdate.bind(this, 'weeklyExecutiveReport');

        this.weeklyExecutiveSummaryUpdate = this.loadWeeklyExecutiveSummary.bind(this);
    }


    componentDidMount() {
        this.loadWeeklyExecutiveSummary();
    }

    
    //call this function???
    loadWeeklyExecutiveSummary(){ 
        const url = 'executivesummary?days=5';
        try {
            apiGet(url).then(resultString => {
                this.setState({weeklyExecutiveSummaryUpdate : resultString});
                console.log(this.state.weeklyExecutiveSummaryUpdate['summary']);

            });
            
        } catch (error) {
            return this.setState({message: {message: error.message, type: 'danger'}});
            
        }
    }
    render() {
        return (
            <div className='col-md-8 col-md-offset-2'>
                <div>
                    <h3>Executive Summary Reports</h3>
                </div>
                <p>hello</p>
            </div>
        );
                
    }

                
 
}
