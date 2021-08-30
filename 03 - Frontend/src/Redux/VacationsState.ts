import VacationModel from "../Models/VacationModel";
 
export class VacationsState {
    public Vacations: VacationModel[] = [];
}

export enum VacationsActionType {
    VacationsDownloaded = "VacationsDownloaded",
    VacationAdded = "VacationAdded",
    VacationUpdated = "VacationUpdated",
    VacationDeleted = "VacationDeleted"
}

export interface VacationsAction {
    type: VacationsActionType; // The action to preform.
    payload: any;             // Data sent to AppState.
}

export function VacationsReducer(currentState: VacationsState = new VacationsState(), action: VacationsAction): VacationsState {

    const newState = { ...currentState }; // ... is JS Spread Operator

    // Perform the action: 
    switch (action.type) {
        case VacationsActionType.VacationsDownloaded:
            newState.Vacations = action.payload; // Here action.payload MUST be the downloaded Vacations array!
            break;
            case VacationsActionType.VacationAdded:
            newState.Vacations.push(action.payload); // Here action.payload MUST be the added Vacation!
            break;
        case VacationsActionType.VacationUpdated:
            console.log(newState);
            break;
        case VacationsActionType.VacationDeleted:
            // ... // Here action.payload MUST be the Vacation id to delete!
            break;
    }

    // Return the new state: 
    return newState;
}
