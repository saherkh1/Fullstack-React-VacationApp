class VacationModel {
    public vacationId: number;
    public description: string;
    public destination: string;
    public image: FileList; // image to upload.
    public startTime: Date;
    public endTime: Date;
    public price: number;
    public followersCount: number;
}

export default VacationModel;

