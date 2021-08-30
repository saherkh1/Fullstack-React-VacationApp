import axios from 'axios';
import store from '../Redux/Store';

const jwtAxios = axios.create(); // Create a new axios object

jwtAxios.interceptors.request.use(request => {
    if(store.getState().authState.user) {
        request.headers = {
            "authorization": "Bearer " + store.getState().authState.user.token
        };
    }
    return request;
});

export default jwtAxios;