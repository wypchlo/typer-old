<template> 
    <div v-if="set">
        <header class="text-center py-6">
            <h1 class="text-4xl font-medium"> {{ set.name }} </h1>
            <p class="font-light text-2xl"> {{ set.description }} </p>
        </header>
        <hr>
        <section class="text-center py-6 flex flex-col items-center">
            <h1 class="text-3xl font-medium py-6"> Pairs </h1>

            <div v-if="pairs.length" id="wordContainer" class="flex-col">
                <div v-for="(pair, index) in pairs" :key="pair" class="flex flex-col justify-center my-2 h-80 w-60 text-center pt-2 bg-gray-100 rounded-xl">
                    <h1 class="text-2xl font-medium"> {{ pair.word }} </h1>
                    <hr>
                    <h1 class="text-2xl font-medium"> {{ pair.translation }} </h1>

                    <button @click.self="deletePair(pair._id, index)"> delete </button>
                </div>
            </div>

            <div v-else class="py-6">
                <h1 class="text-2xl font-light"> This set has no pairs </h1>
            </div>

            <form v-if="tempPair" @submit.prevent="addPair()" class=" bg-gray-50 flex flex-col w-fit h-fit p-6"> 
                <label> <p> word: </p> <input type="text" v-model="tempPair.word"> </label>
                <select v-model="selectedLangs.wordLanguage">
                    <option disabled selected :value="null"> Select a language </option>
                    <option v-for="lang in langs" :key="lang" :value="lang._id"> {{ lang.language }} </option>
                </select>
                <label> <p> translation: </p> <input type="text" v-model="tempPair.translation"> </label>

                <button type="submit"> Confirm </button>
            </form>

            <button class="text-2xl p-6 border" @click="preparePair()"> Add a pair </button>
        </section>
    </div>
</template>

<script>
    import axios from 'axios';

    const BASE_API = 'http://localhost:3000/api';

    export default {
        data() {
            return {
                selectedLangs: {
                    wordLanguage: null,
                    translationLanguage: null
                },
                set: {},
                pairs: [],
                langs: [],
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
            },

            preparePair: function() {
                this.tempPair = {
                    word: null,
                    translation: null,
                    wordLanguageId: null,
                    translationLanguageId: null,
                    setId: this.set['_id']
                }
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
                    const { word, translation, wordLanguageId, translationLanguageId, setId } = this.tempPair;
                    const pair = {
                        word,
                        translation,
                        wordLanguageId,
                        translationLanguageId,
                        setId
                    };

                    await axios.post(`${BASE_API}/pairs/add`, pair);
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