<template>
    <div>
        <h1 class="text-center py-6 text-4xl font-medium"> Recent sets </h1> <hr>

        <div id="container" class="flex justify-center gap-4 py-20">
            <!-- List of sets -->

            <button @click="showSetDetails(set._id)" v-for="(set, index) in sets" :key="set.name" class="justify-around items-center flex flex-col h-80 w-60 text-center pt-2 bg-gray-100 rounded-xl">
                <div>
                    <h1 class="text-3xl"> {{ set.name }} </h1>
                    <p class="text-gray-500"> {{ set.description }} </p>
                </div>
                <button @click.stop="deleteSet(set, index)"><img class="h-6 w-6" src="/src/assets/icons/delete.svg"></button>
            </button>
            
            <!-- Add new set button -->

            <button v-if="!addingSet" @click="addingSet++" class="flex flex-col justify-center items-center h-80 w-60 pt-2 bg-gray-100 rounded-xl"> <p class="text-3xl block"> Add set </p> </button>

            <EditableSet v-else @confirmed="addSet"></EditableSet>
        </div>

        <hr> <h1 class="text-center text-4xl font-medium py-6"> Languages </h1> <hr>
        
        <div id="container" class="flex flex-col justify-center items-center pt-6 gap-4">
            <!-- List of languages -->

            <div v-for="(lang, index) in langs" :key="lang" class="flex flex-col text-center h-20 w-96 bg-gray-100 rounded-xl justify-center">
                <h1 class="text-3xl"> {{ lang.language }} </h1>
                <button @click.stop="deleteLang(lang._id, index)"> Delete </button>
            </div>
            
            <!-- Add a new language -->

            <button v-if="tempLang === null" @click="tempLang = ''" class="flex flex-col items-center h-20 w-96 bg-gray-100 rounded-xl justify-center">
                <h1 class="text-3xl"> Add language </h1>
            </button>

            <div v-else class="flex flex-col text-center h-20 w-96 bg-gray-100 rounded-xl gap-4 justify-center">
                <form @submit.prevent="addLang()"> 
                    <input type="text" v-model="tempLang" class="text-3xl text-center bg-gray-100" placeholder="language">
                    <button type="submit"> Delete </button>
                </form>
            </div>
        </div>
    </div>     
</template>

<script>
    import axios from 'axios';
    import EditableSet from '../components/EditableSet.vue';
    
    const BASE_API = 'http://localhost:3000/api';

    export default {
        data() {
            return{
                sets: [],
                langs: [],
                
                tempLang: null,
                editingIndex: null,
                addingSet: false
            }
        },
        async mounted() {
            await Promise.all([ this.getSets(), this.getLangs() ]);
        },
        methods: {
            getSets: async function() {  
                const { data } = await axios.get(`${BASE_API}/sets`);
                this.sets = data; 
            },
            getLangs: async function() {
                const { data } = await axios.get(`${BASE_API}/languages`);
                this.langs = data;
            },
            addSet: async function(newSet){
                await axios.post('http://localhost:3000/api/sets/add', newSet);
                this.addingSet = false;
                this.getSets();
            },
            deleteSet: async function(set, index) {
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
        },
        components: {
            EditableSet
        }
    }   
</script>