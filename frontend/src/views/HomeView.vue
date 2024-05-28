<template>
    <section class="max-w-[1000px] bg-slate-900 w-full h-full">
        <header class="text-center py-6 font-raleway text-gray-50"> 
            <h1 class="text-4xl font-bold"> recent sets </h1>
        </header>

        <div id="container" class="flex justify-center gap-4 py-20">
            <!-- List of sets -->

            <button @click="showSetDetails(set._id, index)" v-for="(set, index) in sets" :key="set">
                <div v-if="editingIndex != index" class="justify-around items-center flex flex-col h-80 w-60 text-center pt-2 bg-gray-100 rounded-xl">
                    <div>
                        <h1 class="text-3xl"> {{ set.name }} </h1>
                        <p class="text-gray-500"> {{ set.description }} </p>
                    </div>
                    <div class="flex gap-4 justify-center"> 
                        <button @click.stop="deleteSet(set, index)"><img class="h-6 w-6" src="/src/assets/icons/delete.svg"></button>
                        <button @click.stop="editingIndex = index"><img class="h-6 w-6" src="/src/assets/icons/edit.svg"></button>
                    </div>
                </div>

                <EditableSet v-else @confirmed="editSet" :set="set"></EditableSet>
            </button>
            
            <!-- Add new set button -->

            <button v-if="!addingSet" @click="addingSet++" class="w-24 h-24 border-gray-50 rounded-full p-1 outline-none focus:border-2 border-b-4"> 
                <p class="text-[100px] bg-gray-50 rounded-full text-slate-900 w-full h-full flex justify-center items-center"> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg>
                </p> 
            </button>

            <EditableSet v-else @confirmed="addSet"></EditableSet>
        </div>
    </section>
    
    <hr> <h1 class="text-center text-4xl font-medium py-6"> Languages </h1> <hr>
    
    <div id="container" class="flex flex-wrap justify-center items-center py-20 gap-4">

        <div v-for="(lang, index) in langs" :key="lang" class="flex items-center text-left h-20 w-96 bg-gray-100 rounded-xl justify-between px-4">
            <h1 class="text-2xl"> {{ lang.language }} </h1>

            <div class="flex gap-4">
                <button @click.stop="deleteLang(lang._id, index)"><img src="/src/assets/icons/delete.svg" class="w-6 h-6"></button>
                <button><img src="/src/assets/icons/edit.svg" class="w-6 h-6"></button>
            </div>
        </div>

        <button v-if="tempLang === null" @click="tempLang = ''" class="flex flex-col items-center h-20 w-96 bg-gray-100 rounded-xl justify-center">
            <h1 class="text-2xl"> Add language </h1>
        </button>

        <form v-else @submit.prevent="addLang()" class="flex items-center h-20 w-96 bg-gray-100 rounded-xl justify-between px-4"> 
            <input type="text" v-model="tempLang" class="text-2xl texcenter bg-gray-100 w-2/3" placeholder="language">
            <button type="submit"><img src="/src/assets/icons/check.svg" class="w-6 h-6"></button>
        </form>
    </div> 
</template>

<script>
    import axios from 'axios';
    import EditableSet from '../components/EditableSet.vue';
    
    const BASE_API = 'http://192.168.125.199:3000/api';

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
                await axios.post(`${BASE_API}/sets/add`, newSet);
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
            editSet: async function(set) {
                await axios.put(`${BASE_API}/sets/${set._id}`, set);
                this.editingIndex = null;
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
            showSetDetails: function(id, index) {
                if(this.editingIndex == index) return;
                this.$router.push({ name: 'SetDetails', params: { id: id } });
            }
        },
        components: {
            EditableSet
        }
    }   
</script>