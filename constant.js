const getApiEndpoint = () => {
    let API_ENDPOINT;
    switch (process.env.API_ENVIRONMENT) {
        case 'live':
            API_ENDPOINT = "https://dashboard.philippines-hoho.ph/api/v2";
            break;
        case 'staging':
                API_ENDPOINT = "https://staging.philippines-hoho.ph/api/v2";
                break;
        default:
            API_ENDPOINT = "http://127.0.0.1:8000/api/v2";
            break;
    }

    return API_ENDPOINT;
}

export const API_ENDPOINT = getApiEndpoint();

