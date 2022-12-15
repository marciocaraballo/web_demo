import { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import DatePicker from "react-datepicker";
import isEmpty from 'lodash.isempty';
import PropTypes from 'prop-types';

import "react-datepicker/dist/react-datepicker.css";
import "./ModalFormPerson.css";

const ModalFormPerson = ({ show, onClose, onSubmit, person, disabledDniField }) => {
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dni, setDni] = useState(-1);
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [isAlive, setIsAlive] = useState(true);

    const clearState = () => {
        setFirstName('');
        setLastName('');
        setDni(-1);
        setDateOfBirth(new Date());
        setIsAlive(true);
    };

    const close = () => {
        onClose();
        clearState();
    };

    useEffect(() => {
        if (!isEmpty(person)) {
            setFirstName(person.firstName);
            setLastName(person.lastName);
            setDni(person.dni);
            setDateOfBirth(new Date(person.dateOfBirth));
            setIsAlive(person.isAlive);
        }
    }, [person]);

    useEffect(() => {
        if (!show) {
            clearState();
        }
    }, [show]);

    return (
        <Modal show={show} onHide={close}>
            <Modal.Header closeButton onHide={close}>
                <Modal.Title>Create new person</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={async (e) => { 
                        e.preventDefault();
                        onSubmit({ firstName, lastName, dni, dateOfBirth, isAlive });
                    }}>
                    <Form.Group controlId="formFirstName" className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control 
                            autoFocus 
                            required
                            type="text" 
                            placeholder="Enter first name" 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value) }/>
                        {}
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control required type="text" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formDni">
                        <Form.Label>DNI</Form.Label>
                        <Form.Control disabled={disabledDniField} type="number" min={1} placeholder="Enter DNI" value={dni} onChange={(e) => setDni(parseInt(e.target.value, 10))}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formDateOfBirth">
                        <Form.Label>Date of Birth</Form.Label>
                        <DatePicker selected={dateOfBirth} onChange={(date) => setDateOfBirth(date)} />
                    </Form.Group>

                    <Form.Check 
                        type="checkbox"
                        id="checkbox-alive"
                        label="Alive"
                        checked={isAlive}
                        onChange={(e) => { setIsAlive(e.target.checked); }}
                    />

                    <Button variant="secondary" onClick={close}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

ModalFormPerson.propTypes = { 
    show: PropTypes.bool.isRequired, 
    onClose: PropTypes.func.isRequired, 
    onSubmit: PropTypes.func.isRequired, 
    person: PropTypes.object, 
    disabledDniField: PropTypes.bool
};

export default ModalFormPerson;