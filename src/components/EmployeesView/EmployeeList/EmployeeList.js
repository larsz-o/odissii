import React from 'react';
import { connect } from 'react-redux';
import { Grid, Avatar, Table, TableHead, TableCell, TableBody, TableRow } from '@material-ui/core';
import axios from 'axios';
import { PEOPLE_ACTIONS } from '../../../redux/actions/peopleActions';
import orderBy from 'lodash/orderBy';

const moment = require('moment');

const mapStateToProps = state => ({
    user: state.user,
    employees: state.people.staff.supervisorEmployees,
    search: state.search,
    filter: state.filter,
    sort: state.sort,
})

const styles = {
    table: {
        marginTop: 5,
    },
    tableCell: {
    
        textAlign: 'center',
    },
    tableCell2: {
        
    }
}

const invertDirection = {
    asc: 'desc',
    desc: 'asc'
}
class EmployeeList extends React.Component {

    componentDidMount() {
        this.getEmployees();
        orderBy(this.props.people, this.props.sort.column, this.props.sort.direction);
    }

    getEmployees = () => {
        const id = this.props.user.id
        axios({
            method: 'GET',
            url: '/api/staff/employees/' + id
        }).then((response) => {
            const employees = response.data;
            const action = { type: PEOPLE_ACTIONS.SET_SUPERVISOR_EMPLOYEES, payload: employees };
            this.props.dispatch(action);
        }).catch((error) => {
            console.log('Supervisor Employee List get error', error);
            alert('Unable to GET supervisor employees');
        })
    }

    handleSort = columnName => {
        this.props.dispatch({ type: 'ADD_COLUMN_TO_SORT', payload: columnName });
        let direction = this.props.sort.column === columnName ? invertDirection[this.props.sort.direction] : 'desc';
        this.props.dispatch({ type: 'ADD_SORT_DIRECTION', payload: direction });
    }


    render() {
        let content = null;
        let data = orderBy(this.props.employees, this.props.sort.column, this.props.sort.direction);


        if (this.props.user.userName) {
            let filteredEmployees = data.filter(
                (employee) => {
                    return employee.first_name.toLowerCase().indexOf(this.props.search.toLowerCase()) !== -1 || employee.last_name.toLowerCase().indexOf(this.props.search.toLowerCase()) !== -1;
                }
            )
            content = (
                <Table style={styles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={styles.tableCell} onClick={() => this.handleSort('last_name')}>Employee Name</TableCell>
                            <TableCell style={styles.tableCell} onClick={() => this.handleSort('recent')}>Last&nbsp;Feedback</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredEmployees.map((employee) => {
                            return <TableRow key={employee.id} value={employee}>
                                <TableCell style={styles.tableCell}>
                                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                        <Avatar style={{ marginRight: '10px' }} alt={employee.first_name} src={employee.image_path} />
                                        {employee.first_name}&nbsp;{employee.last_name}</div>
                                </TableCell>
                                <TableCell style={styles.tableCell}>
                                    {moment(employee.recent).format("MM/DD/YYYY")}
                                    {/* figure out rendering for it no date */}
                                </TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            )
        }

        return (
            <Grid>
                {content}
            </Grid>
        );
    }
}

export default connect(mapStateToProps)(EmployeeList);