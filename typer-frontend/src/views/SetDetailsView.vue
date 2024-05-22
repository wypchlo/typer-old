<template> 
    <div v-if="set">
        <header class="text-center py-6">
            <h1 class="text-4xl font-medium"> {{ set.name }} </h1>
            <p class="font-light text-2xl"> {{ set.description }} </p>
        </header>
        <hr>
        <section class="text-center py-6 flex flex-col items-center">
            <h1 class="text-3xl font-medium py-6"> Pairs </h1>

            <!-- List of pairs -->

            <div id="wordContainer" class="flex flex-col">
                <div v-for="(pair, index) in pairs" :key="pair" class="flex flex-col justify-around my-2 h-60 w-60 text-center pt-2 bg-gray-100 rounded-xl">
                    <div class="flex flex-col">
                        <h1 class="text-2xl font-medium"> {{ pair.word }} </h1>
                        <p class="text-gray-500"> {{ idLangs[pair.wordLanguageId] }} </p>
                        <br>
                        <h1 class="text-2xl font-medium"> {{ pair.translation }} </h1>
                        <p class="text-gray-500"> {{ idLangs[pair.translationLanguageId] }} </p>
                    </div>

                    <button @click.self="deletePair(pair._id, index)"> delete </button>
                </div>
            </div>

            <!-- Add a new pair --> 
            
            <button v-if="tempPair === null" @click="tempPair = {}" class="flex flex-col items-center justify-around my-2 h-60 w-60 text-center pt-2 bg-gray-100 rounded-xl"> 
                <h1 class="text-2xl font-medium"> Add pair </h1>
            </button>

            <form v-if="tempPair" @submit.prevent="addPair()" class="flex flex-col justify-around my-2 h-60 w-60 text-center pt-2 bg-gray-100 rounded-xl"> 
                <div>
                    <input type="text" v-model="tempPair.word" placeholder="word" class="bg-gray-100 text-2xl font-medium text-center w-full">
                    <select v-model="tempPair.wordLanguageId" class="text-center bg-gray-100 text-gray-500">
                        <option disabled selected :value="undefined"> Select a language </option>
                        <option v-for="lang in langs" :key="lang" :value="lang._id"> {{ lang.language }} </option>
                    </select>
                </div>

                <div>
                    <input type="text" v-model="tempPair.translation" placeholder="translation" class="text-2xl font-medium bg-gray-100 text-center w-full">
                    <select v-model="tempPair.translationLanguageId" class="text-center bg-gray-100 text-gray-500">
                        <option disabled selected :value="undefined"> Select a language </option>
                        <option v-for="lang in langs" :key="lang" :value="lang._id"> {{ lang.language }} </option>
                    </select>
                </div>

                <button type="submit"> Confirm </button>
            </form>
        </section>
    </div>
</template>

<script>
    import axios from 'axios';

    const BASE_API = 'http://localhost:3000/api';

    export default {
        data() {
            return {
                set: {},
                pairs: [],
                langs: [],
                idLangs: {},
                tempPair: null
            }
        },
        async mounted() {
            await Promise.all([this.getset(), this.getPairs(), this.getLanguages()]);
        },
        methods: {
            getPairs: async function() {
                const { data } = await axios.get(`${BASE_API}/pairs/set/${this.$route.params.id}`);
                this.pairs = data;
            },
            getset: async function() {
                const { data } = await axios.get(`${BASE_API}/sets/${this.$route.params.id}`);
                this.set = data;
            },
            getLanguages: async function() {
                const { data } = await axios.get(`${BASE_API}/languages`);
                this.langs = data;
                for(let lang of data) this.idLangs[lang['_id']] = lang.language;
            },
            deletePair: async function(id, index) {
                try {
                    await axios.delete(`${BASE_API}/pairs/${id}`);

                    this.pairs.splice(index, 1);
                }
                catch(error) {
                    console.error(`Error while deleting pair: ${error}`);
                }
            },
            addPair: async function() {
                try {
                    this.tempPair.setId = this.set._id;
                    await axios.post(`${BASE_API}/pairs/add`, this.tempPair);
                    this.tempPair = null;

                    await this.getPairs();
                }
                catch(error) {
                    console.error(`Error while adding pair to set: ${error}`);
                }
            }
        }
    }
</script>