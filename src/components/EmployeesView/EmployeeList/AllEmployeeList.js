import React from 'react';
import { connect } from 'react-redux';
import { Grid, Avatar, IconButton, Table, TableHead, TableCell, TableBody, TableRow } from '@material-ui/core';
import { USER_ROLES } from '../../../constants';
import { PEOPLE_ACTIONS } from '../../../redux/actions/peopleActions';
import Edit from '@material-ui/icons/Edit';

const moment = require('moment');

const mapStateToProps = state => ({
    user: state.user,
    people: state.people.staff.allEmployees,
    employees: state.people.staff.supervisorEmployees,
    search: state.search,
    filter: state.filter,
})

const styles = {
    table: {
        marginTop: 5,
    },
    tableCell : {
        padding: 0,
        textAlign: 'center',
    }
}

class AllEmployeeList extends React.Component {

    componentDidMount() {
        this.getEmployees();
    }

    getEmployees = () => {
        this.props.dispatch({ type: PEOPLE_ACTIONS.FETCH_ALL_EMPLOYEES });
    }

    getEmpoloyeesByName = () => {
        if (this.props.filter === '' || this.props.filter === 'name') {
            this.getEmpoloyeesByName();
        } else if (this.props.filter === 'date') {
            this.getEmployeesByFeedbackDate();
        } else if (this.props.filter === 'feedback') {
            this.getEmployeesByFeedbackQuantity();
        }
    }

    getEmployeesByFeedbackDate = () => {

    }

    getEmployeesByFeedbackQuantity = () => {

    }

    render() {
        let content = null;
        if (this.props.user.role === USER_ROLES.MANAGER) {
            let filteredEmployees = this.props.people.filter(
                (employee) => {
                    return employee.first_name.toLowerCase().indexOf(this.props.search.toLowerCase()) !== -1 || employee.last_name.toLowerCase().indexOf(this.props.search.toLowerCase()) !== -1;
                }
            )
            content = (
                <Table style={styles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={styles.tableCell}>Employee Name</TableCell>
                            <TableCell style={styles.tableCell}>Last&nbsp;Feedback</TableCell>
                            <TableCell style={styles.tableCell}>Edit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredEmployees.map((employee) => {
                            return <TableRow key={employee.id} value={employee}>
                                <TableCell style={styles.tableCell}>
                                        <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
                                            <Avatar style={{marginRight: '10px', marginLeft: '10px'}} alt={employee.first_name} src={employee.image_path} />
                                            {employee.first_name}&nbsp;{employee.last_name}</div>
                                </TableCell>
                                <TableCell style={styles.tableCell}>
                                {moment(employee.recent).format("MM/DD/YYYY")} 
                                {/* figure out redering for if no date */}
                                </TableCell>
                                <TableCell style={styles.tableCell}>
                                    <IconButton>
                                        <Edit />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            );
        }
        return (
            <Grid>
                    {content}
            </Grid>
        );
    }
}

export default connect(mapStateToProps)(AllEmployeeList);