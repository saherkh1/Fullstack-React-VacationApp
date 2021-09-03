import { Notyf } from "notyf"; 
class Notify {
    
    private notification = new Notyf({ duration: 4000, position: { x: "left", y: "top" } });

    public success(message: string): void {
        this.notification.success(message);
    }

    public error(err: any): void {
        const message = this.getErrorMessage(err);
        this.notification.error(message);
    }

    private getErrorMessage(err: any): string {

        if(typeof err === "string") {
            return err;
        }

        if(typeof err.response?.data === "string") { // response.data belongs to Axios
            return err.response.data;
        }

        if(Array.isArray(err.response?.data)) { // If server returns array of errors
            return err.response.data[0];
        }

        if(typeof err.message === "string") { // Must be last
            return err.message;
        }

        return "Some error occurred, please try again.";
    }

}

const notify = new Notify();

export default notify;
