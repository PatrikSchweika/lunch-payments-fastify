import axios from "axios";

const BASE_PLATFORM_URL = new URL(document.baseURI).pathname

export const API_CLIENT = axios.create({
    baseURL: BASE_PLATFORM_URL,
})
