class UserModel {
	public id: number;
    public firstName: string;
    public lastName: string;
    public username: string;
    public password: string;
    public token: string; // JWT: JSON Web Token - one string which the backend creates and sends us by which we can enter certain routes in the backend.
}

export default UserModel;
