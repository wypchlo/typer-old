<template>
    <div>
        <h1 class="text-center py-6 text-4xl font-medium"> Recent sets </h1> <hr>

        <div id="container" class="flex justify-center gap-4 py-20">
            <button @click="showSetDetails(set._id)" v-for="(set, index) in sets" :key="set.name" class="justify-around items-center flex flex-col h-80 w-60 text-center pt-2 bg-gray-100 rounded-xl">
                <div>
                    <h1 class="text-3xl"> {{ set.name }} </h1>
                    <p> {{ set.description }} </p>
                </div>
                <button @click.stop="deleteset(set, index)"> Delete </button>
            </button>

            <button v-if="tempset == null" @click="tempset = {}" class="flex flex-col justify-center items-center h-80 w-60 pt-2 bg-gray-100 rounded-xl">
                <p class="text-3xl block"> Add new set </p>
            </button>

            <form v-else @submit.prevent="addset()" class="flex flex-col justify-around items-center h-80 w-60 pt-2 bg-gray-100 rounded-xl">
                <div>
                    <input type="text" v-model="tempset.name" placeholder="name" class="text-3xl text-center w-full bg-gray-100">
                    <input type="text" v-model="tempset.description" placeholder="description" class="w-full bg-gray-100 text-center">
                </div>
                <button type="submit"> Submit </button>
            </form>
        </div>

        <hr> <h1 class="text-center text-4xl font-medium py-6"> Languages </h1> <hr>
        
        <div id="container" class="flex flex-col justify-center items-center pt-6 gap-4">
            <div v-for="(lang, index) in langs" :key="lang" class="flex flex-col text-center h-20 w-96 bg-gray-100 rounded-xl justify-center">
                <h1 class="text-3xl"> {{ lang.language }} </h1>
                <button @click.stop="deleteLang(lang._id, index)"> Delete </button>
            </div>
            <div class="flex flex-col text-center h-20 w-96 bg-gray-100 rounded-xl gap-4 justify-center">
                <form @submit.prevent="addLang()"> 
                    <input type="text" v-model="tempLang" class="text-3xl text-center bg-gray-100" placeholder="Add language">
                </form>
            </div>
        </div>
    </div>     
</template>

<script>
    import axios from 'axios';
    
    const BASE_API = 'http://localhost:3000/api';

    export default {
        data() {
            return{
                sets: [],
                langs: [],
                
                tempLang: null,
                tempset: null
            }
        },
        async mounted() {
            await Promise.all([ this.getsets(), this.getLangs() ]);
        },
        methods: {
            getsets: async function() {  
                const { data } = await axios.get(`${BASE_API}/sets`);
                this.sets = data; 
            },
            getLangs: async function() {
                const { data } = await axios.get(`${BASE_API}/languages`);
                this.langs = data;
            },
            addset: async function(){
                await axios.post('http://localhost:3000/api/sets/add', this.tempset);
                this.tempset = null;
                this.getsets();
            },
            deleteset: async function(set, index) {
                try {
                    await axios.delete(`${BASE_API}/sets/${set._id}`);
                    this.sets.splice(index, 1);
                }
                catch(error) {
                    console.log('failed to delete set with error: ' + error)
                } 
            },
            addLang: async function() {
                await axios.post(`${BASE_API}/languages/add`, { language: this.tempLang });
                this.getLangs();
                this.tempLang = null;
            },
            deleteLang: async function(id, index) {
                await axios.delete(`${BASE_API}/languages/${id}`,);
                this.langs.splice(index, 1);
            },
            showSetDetails: function(id) {
                this.$router.push({ name: 'SetDetails', params: { id: id } });
            }
        }
    }   
</script>