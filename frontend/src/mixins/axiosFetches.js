import axios from 'axios';
const BASE_API = 'http://192.168.125.199:3000/api';

export const axiosFetchesMixin = {
    methods: {
        async getSets() {
            const { data } = await axios.get(`${BASE_API}/sets`);
            return data;
        },
        async getLangs() {
            const { data } = await axios.get(`${BASE_API}/languages`);
            return data;
        },
        async addSet(newSet) {
            await axios.post(`${BASE_API}/sets/add`, newSet);
        },
        async deleteSet(set) { 
            await axios.delete(`${BASE_API}/sets/${set._id}`);
        },
        async deleteSets(ids) {
            await axios.delete(`${BASE_API}/sets`, { data: { ids } })
        },
        async getSetPairs(setId) {
            const { data } = await axios.get(`${BASE_API}/pairs/set/${setId}`);
            return data;
        },
        async getSet(setId) {
            const { data } = await axios.get(`${BASE_API}/sets/${setId}`);
            console.log(data);
            return data;
        },
        async addPair(pair) {
            await axios.post(`${BASE_API}/pairs/add`, pair);
        },
        async deletePairs(ids) {
            await axios.delete(`${BASE_API}/pairs`, { data: { ids } })
        },
    }
}

export default axiosFetchesMixin;