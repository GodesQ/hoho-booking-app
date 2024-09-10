
const getApiEndpoint = () => {
    let API_ENDPOINT;

    if(process.env.API_ENVIRONMENT == 'live') {
        API_ENDPOINT = "https://dashboard.philippines-hoho.ph/api/v2";
    } else if(process.env.API_ENVIRONMENT == 'staging') {
        API_ENDPOINT = "https://dashboard.philippines-hoho.ph/api/v2";
    } else {
        API_ENDPOINT = "https://dashboard.philippines-hoho.ph/api/v2";
    }

    return API_ENDPOINT;
}

export const API_ENDPOINT = getApiEndpoint();