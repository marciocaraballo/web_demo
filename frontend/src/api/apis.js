const fetchUtil = async (method, url, payload) => {

    const urlWithHostname = `http://localhost:2999${url}`;

    let fetchOptions = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (method === 'POST' || method === 'PUT') {
        fetchOptions = {
            ...fetchOptions,
            body: JSON.stringify(payload)
        }
    };

    const response = await fetch(urlWithHostname, fetchOptions);

    if (response.ok && (method === 'GET' || method === 'POST' || method === 'PUT')) {
        return await response.json();
    } else {
        if (response.ok && method === 'DELETE') {
            return Promise.resolve({});
        } else {
            return Promise.reject(response);
        }
    };
}

const createPerson = async (personPayload) => await fetchUtil('POST', '/person', personPayload);
const editPerson = async (personPayload) => await fetchUtil('PUT', `/person/${personPayload.dni}`, personPayload);
const listPeople = async (peopleFilter) => await fetchUtil('GET', peopleFilter === 'all' ? '/persons' : `/persons?isAlive=${peopleFilter === 'alive'}`);
const removePerson = async (dni) => await fetchUtil('DELETE', `/person/${dni}`); 
const removeAllPeople = async () => await fetchUtil('DELETE', '/persons');

const DUPLICATED_RESOURCE_ERROR = 409;

export {
    createPerson,
    editPerson,
    listPeople,
    removePerson,
    removeAllPeople,

    DUPLICATED_RESOURCE_ERROR
};