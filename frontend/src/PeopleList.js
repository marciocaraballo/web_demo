import { useState } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ModalConfirm from './components/ModalConfirm';
import ModalFormPerson from './components/ModalFormPerson';
import isEmpty from 'lodash.isempty';
import PropTypes from 'prop-types';

import { removePerson, editPerson, listPeople, DUPLICATED_RESOURCE_ERROR } from './api/apis';

import './PeopleList.css';

const PeopleList = ({ people, setPeople, setSuccessNotification, setErrorNotification, peopleFilter }) => {

    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [showPersonCreate, setShowPersonCreate] = useState(false);
    const [dniToDelete, setDniToDelete] = useState(-1);
    const [personToEdit, setPersonToEdit] = useState({});

    return (
        <div>
            <div className="people-table">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>DNI</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Full Name</th>
                            <th>Date of Birth</th>
                            <th>Alive?</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            isEmpty(people) ?
                            (
                                <tr>
                                    <td colSpan={7}>No data available</td>
                                </tr>
                            ) :
                            people.map(person => 
                                <tr key={`${person.dni}`}>
                                    <td>{person.dni}</td>
                                    <td>{person.firstName}</td>
                                    <td>{person.lastName}</td>
                                    <td>{person.fullName}</td>
                                    <td>{new Date(person.dateOfBirth).toDateString()}</td>
                                    <td>{person.isAlive ? 'Yes' : 'No'}</td>
                                    <td>
                                    <ButtonGroup>
                                        <Button 
                                            variant="warning" 
                                            onClick={() => {
                                                setPersonToEdit(person); 
                                                setShowPersonCreate(true); 
                                            }}>
                                                Edit
                                            </Button>
                                        <Button 
                                            variant="danger" 
                                            onClick={() => { 
                                                setShowModalConfirm(true);
                                                setDniToDelete(person.dni);
                                            }}>
                                                Remove
                                        </Button>
                                    </ButtonGroup>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
            </div>
            <ModalFormPerson 
                disabledDniField={true}
                person={personToEdit}
                show={showPersonCreate} 
                onClose={() => setShowPersonCreate(false)}
                onSubmit={async (personData) => {

                    try {
                        await editPerson(personData);
                        const latestPeople = await listPeople(peopleFilter);

                        setPeople(latestPeople);
                        
                        setPersonToEdit({});
                        setShowPersonCreate(false);
                        setSuccessNotification('Person edited succesfully.');
                    } catch(e) {
                        if (e.status === DUPLICATED_RESOURCE_ERROR) {
                            setErrorNotification('DNI already exists.');
                        } else {
                            setErrorNotification('Something went wrong. Please try again later.');
                        }
                    }
                }}
            />
            <ModalConfirm 
                show={showModalConfirm} 
                onClose={() => setShowModalConfirm(false)}
                onConfirm={async () => {
                    try {
                        await removePerson(dniToDelete);
                        const latestPeople = await listPeople(peopleFilter);

                        setPeople(latestPeople);
                        setDniToDelete(-1);
                        setShowModalConfirm(false);
                        setSuccessNotification('Person removed succesfully.');
                    } catch(e) {
                        setErrorNotification('Something went wrong. Please try again later.');
                    }
                }}
            />
        </div>
    );
}

PeopleList.propTypes = { 
    people: PropTypes.array.isRequired, 
    setPeople: PropTypes.func.isRequired,
    setSuccessNotification: PropTypes.func.isRequired,
    setErrorNotification: PropTypes.func.isRequired,
    peopleFilter: PropTypes.string.isRequired
}

export default PeopleList;