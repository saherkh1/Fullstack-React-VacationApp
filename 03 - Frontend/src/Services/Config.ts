// configuration for both development and production...
abstract class Config {

    public isDevelopment = (process.env.NODE_ENV === "development");

    public readonly registerUrl: string;
    public readonly loginUrl: string;
    public readonly vacationsUrl: string;
    public readonly vacationImagesUrl: string;

    public constructor(baseUrl: string) {
        this.registerUrl = baseUrl + "auth/register/";
        this.loginUrl = baseUrl + "auth/login/";
        this.vacationsUrl = baseUrl + "vacations/";
        this.vacationImagesUrl = baseUrl + "vacations/images/";
    }
}

// configuration for development environment...
class DevelopmentConfig extends Config {
    public constructor() {
        super("http://localhost:3001/api/");
    }
}

// configuration for production environment...
class ProductionConfig extends Config {
    public constructor() {
        super("http://www.mysite.com/api/");
    }
}

const config = process.env.NODE_ENV === "development" ? new DevelopmentConfig() : new ProductionConfig();

export default config;