import { FollowedVacationReducer, FollowedVacationState } from './FollowedVacationState';
import { combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import config from "../Services/Config";
import { authReducer } from "./AuthState";
import { VacationsReducer } from "./VacationsState";

// Create an object containing all the reducers: 
// const reducers = combineReducers({ productsState: productsReducer, employeesState: employeesReducer, catState: catReducer });
const reducers = combineReducers({ VacationsState: VacationsReducer, authState: authReducer ,FollowedVacationState: FollowedVacationReducer});

// Crete the store object:
const store = createStore(reducers, config.isDevelopment ? composeWithDevTools() : undefined); // composeWithDevTools() connects our Redux to Redux DevTool chrome extension

// Export the store:
export default store;