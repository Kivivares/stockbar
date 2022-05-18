import axios from "axios";

const API_URL = 'api/drinks/'

const createDrink = async (drinkData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL, drinkData, config)

    return response.data
}

const getDrinks = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL, config)

    return response.data
}

const deleteDrink = async (drinkId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL + drinkId, config)

    return response.data
}

const editDrink = async (drinkData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL + drinkData._id, drinkData, config)

    return response.data
}

const drinkService = {
    createDrink,
    getDrinks,
    deleteDrink,
    editDrink,
}

export default drinkService