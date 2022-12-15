import Alert from 'react-bootstrap/Alert';
import PropTypes from 'prop-types';

import './Notification.css';

const ERROR_TYPE = 'error';
const SUCCESS_TYPE = 'success';

const types = {
    [ERROR_TYPE]: 'danger',
    [SUCCESS_TYPE]: 'success'
}

const Notification = ({ message, type = SUCCESS_TYPE, onClose }) => {

    setTimeout(() => {
        onClose();
    }, 5000);

    if (message) {
        return (
            <div className='notification'>
                <Alert variant={types[type]}>
                    {message}
                </Alert>
            </div>
        );
    }

    return null;
}

Notification.propTypes = {
    message: PropTypes.string, 
    type: PropTypes.string, 
    onClose: PropTypes.func.isRequired 
};

export {
    Notification,
    ERROR_TYPE,
    SUCCESS_TYPE
};
