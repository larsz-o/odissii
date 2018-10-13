import React from 'react';
import { Grid, IconButton } from '@material-ui/core'; 
import { Edit } from '@material-ui/icons';
import IndividualManagerGraph from './Graphs/IndividualManagerGraph';
import ManagerOverviewGraph from './Graphs/ManagerOverviewGraph'; 
import { connect } from 'react-redux';
import { USER_ACTIONS } from '../../../redux/actions/userActions';
import axios from 'axios';
import './ManagerDashboard.css';

const mapStateToProps = state => ({
  user: state.user,
  people: state.people,
  feedback: state.feedback,
  graphFeedback: state.feedback.supervisorOverview
});

class ManagerDashboard extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        supervisors: [],
        sortedSupervisors: [],
        feedbackData: [],
        totalFeedback: [], 
        praise: [],
        correct: [],
        instruct: []
      }
  }
  componentWillMount(){
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
    this.getSupervisors(); 
  }
  editPerson = (id) => {
    this.props.history.push(`/edit/supervisor/${id}`);
  }
  getSupervisors = () => {
    axios({
      method: 'GET',
      url: '/api/staff/supervisors'
    }).then((response) => {
      console.log(response.data); 
      this.setState({
        supervisors: response.data
      });
      this.getSupervisorFeedbackReports(response.data); 
      this.sortSupervisors();
    }).catch((error) => {
      console.log('Error getting supervisors', error); 
    })
  }
  getFeedbackCounts = (id) => {
    let year = new Date().getFullYear();
    console.log(year)
    let start = '01-01-' + year
    let end = '12-31-' + year
    axios({
      method: 'GET',
      url: `/api/feedback/supervisors/count?id=${id}&start=${start}&end=${end}`
    }).then((response) => {
      this.setState({
        feedbackData: [...this.state.feedbackData, response.data], 
        totalFeedback: response.data
      });
      this.sortData(); 
    }).catch((error) => {
      console.log('Error getting supervisors', error); 
    })
  }
  getSupervisorFeedbackReports = (array) => {
    for (let i = 0; i < array.length; i++){
      let id = array[i].supervisor_id; 
      this.getFeedbackCounts(id); 
    }
  }
  sortSupervisors = () => {
    for(let i = 0; i < this.state.supervisors.length; i++){
      console.log(this.state.supervisors[i]);
      this.setState({
        sortedSupervisors: [...this.state.sortedSupervisors, this.state.supervisors[i].first_name + ' ' + this.state.supervisors[i].last_name,]
      })
    }
  }
  sortData = () => {
    for(let i = 0; i < this.state.totalFeedback.length; i++){
          this.setState({
            praise: [...this.state.praise, parseInt(this.state.totalFeedback[i].praise)],
            correct: [...this.state.correct, parseInt(this.state.totalFeedback[i].correct)],
            instruct: [...this.state.instruct, parseInt(this.state.totalFeedback[i].instruct)],
          })   
        }
      
    }
  render(){
    return (
      <div>
        <Grid container xs={12} spacing={0}>
        <Grid item xs={12}>
          <h1>Manager's Dashboard</h1>
            <p className="center">Feedback given since January 1</p>
            </Grid>
            <Grid item xs={12}>
              <ManagerOverviewGraph supervisors={this.state.sortedSupervisors} praise={this.state.praise} correct={this.state.correct} instruct={this.state.instruct}/> 
            </Grid>
          <Grid item xs={12}>
              <h2 className="center">All Supervisors</h2>
          </Grid>
                      {this.state.feedbackData.map((array, i) => {
                        return(
                        <div key={i}>
                          <span>{array.map((feedback)=> {
                              return(
                               <Grid item xs={12} lg={8} key={feedback.sid}>
                                <div className="card">
                                      <h3>{feedback.first_name} {feedback.last_name} <IconButton onClick={()=> this.editPerson(feedback.sid)}><Edit/></IconButton></h3>
                                      <a href="#summary">Summary</a><br/>
                                      <a href="#employees">Employees</a><br/>
                                       <p>Feedback given since January 1</p>
                                        <IndividualManagerGraph feedback={feedback} key={i}/> 
                                </div>
                              </Grid>
                              );
                            })}
                          </span>
                        </div>
                      );
                  })} 
         </Grid>
        </div>
    );
  }
}
export default connect(mapStateToProps)(ManagerDashboard);