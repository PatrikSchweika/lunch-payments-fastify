import axios from 'axios'

const BASE_PLATFORM_URL = window.location.origin

export const API_CLIENT = axios.create({
  baseURL: BASE_PLATFORM_URL,
})
