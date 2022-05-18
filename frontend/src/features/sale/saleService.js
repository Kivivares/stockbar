import axios from "axios";

const API_URL = 'api/sales/'

const saveSingleSale = async (saleData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL + 'single', saleData, config)

    return response.data
}

const saleService = {
    saveSingleSale,
}

export default saleService