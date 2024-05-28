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
        async editSet(set) {
            await axios.put(`${BASE_API}/sets/${set._id}`, set);
            this.editingIndex = null;
        },
        async addLang() {
            await axios.post(`${BASE_API}/languages/add`, { language: this.tempLang });
            this.getLangs();
            this.tempLang = null;
        },
        async deleteLang(id, index) {
            await axios.delete(`${BASE_API}/languages/${id}`,);
            this.langs.splice(index, 1);
        },
    }
}

export default axiosFetchesMixin;