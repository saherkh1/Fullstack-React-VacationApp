import VacationModel from "../Models/VacationModel";
import socketService from "../Services/SocketService";

export class VacationsState {
    public Vacations: VacationModel[] = [];
}

export enum VacationsActionType {
    VacationsDownloaded = "VacationsDownloaded",
    VacationAdded = "VacationAdded",
    VacationUpdated = "VacationUpdated",
    VacationDeleted = "VacationDeleted",
}

export interface VacationsAction {
    type: VacationsActionType; // The action to preform.
    payload: any;             // Data sent to AppState.
}

export function VacationsReducer(currentState: VacationsState = new VacationsState(), action: VacationsAction): VacationsState {

    const newState = { ...currentState };
    // Perform the action: 
    switch (action.type) {
        case VacationsActionType.VacationsDownloaded:
            newState.Vacations = action.payload; // Here action.payload MUST be the downloaded Vacations array!
            break;
        case VacationsActionType.VacationAdded:
            newState.Vacations.push(action.payload); // Here action.payload MUST be the added Vacation!
            break;
        case VacationsActionType.VacationUpdated:
            // Here action.payload MUST be the updated Vacation!
            const updatedState: VacationModel[] = newState.Vacations.filter((value) => value.vacationId !== +action.payload.vacationId);
            updatedState.push(action.payload);
            newState.Vacations = updatedState.sort((a, b) => a.vacationId - b.vacationId);
            break;
        case VacationsActionType.VacationDeleted:
            // Here action.payload MUST be the VacationId to delete!
            const deletedState: VacationModel[] = newState.Vacations.filter((value) => value.vacationId !== +action.payload);
            newState.Vacations = deletedState;
            break;

    }
    // Return the new state: 
    return newState;
}
