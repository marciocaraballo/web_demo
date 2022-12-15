import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';

const ModalConfirm = ({ onClose, show, onConfirm }) => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton onHide={onClose}>
                <Modal.Title>Are you sure you want to proceed?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={(e) => { e.preventDefault(); onConfirm(); }}>
                    <Button variant="secondary" onClick={onClose}>
                        No
                    </Button>
                    <Button variant="danger" type="submit">
                        Yes
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

ModalConfirm.propTypes = { 
    onClose: PropTypes.func.isRequired, 
    show: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired
};

export default ModalConfirm;