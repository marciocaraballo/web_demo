import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Notification, SUCCESS_TYPE, ERROR_TYPE } from './components/Notification';

import ModalConfirm from './components/ModalConfirm';
import ModalFormPerson from './components/ModalFormPerson';
import PeopleList from './PeopleList';
import './App.css';
import Form from 'react-bootstrap/Form';

import { createPerson, listPeople, removeAllPeople, DUPLICATED_RESOURCE_ERROR } from './api/apis';

const ALL_PEOPLE = 'all';
const ALIVE_PEOPLE = 'alive';
const DECEASED_PEOPLE = 'deceased';

function App() {

  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState(SUCCESS_TYPE);
  const [people, setPeople] = useState([]);
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [peopleFilter, setPeopleFilter] = useState(ALL_PEOPLE);

  useEffect(() => {

    async function fetchData() {

        try {
          const peopleList = await listPeople(peopleFilter);

          setPeople(peopleList);
        } catch(e) {
          setErrorNotification('Something went wrong. Please try again later.');
        }
      }

      fetchData();

}, [peopleFilter]);

  const setSuccessNotification = (message) => {
    setNotificationType(SUCCESS_TYPE);
    setNotificationMessage(message);
  };

  const setErrorNotification = (message) => {
    setNotificationType(ERROR_TYPE);
    setNotificationMessage(message);
  }

  return (
    <div className='app'>
      <header>
        <h2>App - People list</h2>
        <div className="app-list-header">
          <p>
            Find below a list of people.
            People can be added, removed and associated data can be edited.
            Filters are provided to either show all people, filter by alive or deceased.
          </p>
          <ButtonGroup>
            <Button 
              variant="primary" 
              onClick={() => setShowPersonForm(true)}>
                Add
            </Button>
            <Button 
              variant="danger"
              onClick={() => setShowModalConfirm(true)}>
                Remove all
            </Button>
          </ButtonGroup>
        </div>
        <div>
            <Form>
            <Form.Group controlId="formIsAliveFilter" className="mb-3">
                <Form.Label>Show: </Form.Label>
                <Form.Check 
                    type="checkbox"
                    id="checkbox-filter-all"
                    label="All"
                    checked={peopleFilter === ALL_PEOPLE}
                    onChange={() => { setPeopleFilter(ALL_PEOPLE); }}
                />
                <Form.Check 
                    type="checkbox"
                    id="checkbox-filter-alive"
                    label="Alive"
                    checked={peopleFilter === ALIVE_PEOPLE}
                    onChange={() => { setPeopleFilter(ALIVE_PEOPLE); }}
                />
                <Form.Check 
                    type="checkbox"
                    id="checkbox-filter-deceased"
                    label="Deceased"
                    checked={peopleFilter === DECEASED_PEOPLE}
                    onChange={() => { setPeopleFilter(DECEASED_PEOPLE); }}
                />
            </Form.Group>
            </Form>
          </div>
        <PeopleList 
          peopleFilter={peopleFilter}
          people={people} 
          setPeople={setPeople}
          setSuccessNotification={setSuccessNotification}
          setErrorNotification={setErrorNotification}/>
        <ModalFormPerson 
          show={showPersonForm} 
          onClose={() => setShowPersonForm(false)}
          onSubmit={async (personData) => {
            try {
              await createPerson(personData);

              const latestPeople = await listPeople(peopleFilter);

              setPeople(latestPeople);
              setShowPersonForm(false);
              setSuccessNotification('Person added succesfully.');
            } catch (e) {
              if (e.status === DUPLICATED_RESOURCE_ERROR) {
                setErrorNotification('DNI already exists.');
              } else {
                setErrorNotification('Something went wrong. Please try again later.');
              }
            }

          }}/>
        <ModalConfirm 
          show={showModalConfirm} 
          onClose={() => setShowModalConfirm(false)}
          onConfirm={async () => {
            try {
              await removeAllPeople();
              setPeople([]);
              setShowModalConfirm(false);
              setSuccessNotification('All data removed succesfully.');
            } catch(e) {
              setErrorNotification('Something went wrong. Please try again later.');
              throw e;
            }
          }}/>
        <Notification
          type={notificationType} 
          onClose={() => setNotificationMessage('')}
          message={notificationMessage}/>
      </header>
    </div>
  );
}

export default App;
