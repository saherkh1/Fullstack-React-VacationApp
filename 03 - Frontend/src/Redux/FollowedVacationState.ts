import FollowedVacationModel from "../Models/FollowedVacationModel";

export class FollowedVacationState {
    public followedVacations: FollowedVacationModel[] = [];   
}

// Auth Action Types: 
export enum FollowedVacationActionType {
    FollowedDownload = "FollowedDownload",
    Followed = "Followed",
    UnFollowed = "UnFollowed",
}

// Auth Action: 
export interface FollowedVacationAction {
    type: FollowedVacationActionType;
    payload?: any; // Optional because on logout there is no payload.
}

// Auth Reducer: 
export function FollowedVacationReducer(currentState: FollowedVacationState = new FollowedVacationState() , action: FollowedVacationAction): FollowedVacationState {
    
    const newState = { ...currentState };

    switch(action.type) {
        case FollowedVacationActionType.FollowedDownload:
            newState.followedVacations = action.payload; // Here action.payload MUST be the one followedVacationOBJ!
            break;
        case FollowedVacationActionType.Followed:
            newState.followedVacations.push(action.payload); // Here action.payload MUST be the one followedVacationOBJ!
            break;
        case FollowedVacationActionType.UnFollowed:
            const deletedState = newState.followedVacations.filter((value)=> value.vacationId !== action.payload); // Here action.payload MUST be the one un followedVacationOBJ!
            newState.followedVacations = deletedState;
            break;
    }
    return newState;
}

