import { VacationsAction, VacationsActionType } from './../Redux/VacationsState';
import VacationModel from "../Models/VacationModel";
import store from "../Redux/Store";
import jwtAxios from "./jwtAxios";
import config from './Config';

export const isVacationsInStore = () => store.getState().VacationsState.Vacations.length !== 0;
export async function downloadVacationsToStore() {
    const response = await jwtAxios.get<VacationModel[]>(config.vacationsUrl);
    store.dispatch({ type: VacationsActionType.VacationsDownloaded, payload: response.data });
}
export function getVacation(vacationId: number)  {
    (!isVacationsInStore) && downloadVacationsToStore();
    return ({ ...store.getState().VacationsState.Vacations
        .find(oneVacation => oneVacation.vacationId === vacationId) })
}

export async function updateVacationWithFormDataAsync(myFormData: FormData, vacationId: number) {
    const response = await jwtAxios.patch<VacationModel>(
        config.vacationsUrl + vacationId,
        myFormData
    );
    const vacationsAction: VacationsAction = {
        type: VacationsActionType.VacationUpdated,
        payload: response.data,
    };
    store.dispatch(vacationsAction);
    return vacationsAction;
}
