import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8081/sbee'
})

api.interceptors.request.use((config) => {

    const token = sessionStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    // LOG del request
    console.group(`📤 Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log("Base URL:", config.baseURL);
    console.log("Headers:", config.headers);
    console.log("Params:", config.params);
    console.log("Body:", config.data);
    console.groupEnd();

    return config
},
    (error) => {
        console.error("❌ Error en request:", error);
        return Promise.reject(error);
    }
)

// Interceptor de responses
api.interceptors.response.use(
    (response) => {
        // LOG de la respuesta
        console.group(`📥 Response: ${response.config.url}`);
        console.log("Status:", response.status);
        console.log("Data:", response.data);
        console.groupEnd();
        return response;
    },
    (error) => {
        if (error.response) {
            // Error del servidor
            console.group(`❌ Error Response: ${error.config?.url}`);
            console.log("Status:", error.response.status);
            console.log("Data:", error.response.data);
            console.groupEnd();
        } else {
            // Error de conexión o timeout
            console.error("🚫 Error sin respuesta:", error.message);
        }
        return Promise.reject(error);
    }
);
export default api