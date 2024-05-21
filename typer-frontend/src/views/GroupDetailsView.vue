<template> <div v-if="group">
        <header class="text-center py-6">
            <h1 class="text-4xl font-medium"> {{ group.name }} </h1>
            <p class="font-light text-2xl"> {{ group.description }} </p>
        </header>
        <hr>
        <section class="text-center py-6 flex flex-col items-center">
            <h1 class="text-3xl font-medium py-6"> Pairs </h1>

            <div v-if="pairs.length" id="wordContainer" class="flex-col">
                <div v-for="(pair, index) in pairs" :key="pair" class="flex flex-col justify-center py-6 px-10 my-2 bg-gray-200 rounded-xl">
                    <h1 class="text-2xl font-medium"> {{ pair.word }} </h1>
                    <hr>
                    <h1 class="text-2xl font-medium"> {{ pair.translation }} </h1>

                    <button @click.self="deletePair(pair['_id'], index)"> delete </button>
                </div>
            </div>
            <div v-else class="py-6">
                <h1 class="text-2xl font-light"> This group has no pairs </h1>
            </div>

            <form v-if="tempPair" @submit.prevent="handleSubmit()" class=" bg-gray-50 flex flex-col w-fit h-fit p-6"> 
                <label> word: <input type="text" v-model="tempPair.word"> </label>        
                <label> translation: <input type="text" v-model="tempPair.translation"> </label>

                <button type="submit"> Confirm </button>
            </form>

            <button class="text-2xl p-6 border" @click="addPair()"> Add a pair </button>
        </section>
    </div>
</template>

<script>
    import axios from 'axios';
    import TempPairItem from '../components/TempPairItem.vue';

    export default {
        data() {
            return {
                group: {},
                pairs: [],
                tempPair: null
            }
        },
        mounted() {
            this.getDetails()
        },
        methods: {
            getPairs: async function() {
                const pairs = await axios.get(`http://localhost:3000/api/pairs/group/${this.$route.params.id}`);
                this.pairs = pairs.data;
            },
            getDetails: async function() {
                const group = await axios.get(`http://localhost:3000/api/groups/${this.$route.params.id}`);
                this.group = group.data;

                await this.getPairs();
            },
            addPair: function() {
                this.tempPair = {
                    word: null,
                    translation: null,
                    wordLanguageId: null,
                    translationLanguageId: null,
                    groupId: this.group['_id']
                }
            },
            deletePair: async function(id, index) {
                try {
                    console.log(index);
                    console.log(id);
                    await axios.delete(`http://localhost:3000/api/pairs/${id}`);

                    this.pairs.splice(index, 1);
                }
                catch(error) {
                    console.error(`Error while deleting pair: ${error}`);
                }
            },
            handleSubmit: async function() {
                try {
                    const {word, translation, wordLanguageId, translationLanguageId, groupId} = this.tempPair;
                    const pair = {
                        word,
                        translation,
                        wordLanguageId,
                        translationLanguageId,
                        groupId
                    };

                    await axios.post('http://localhost:3000/api/pairs/add', pair);
                    await this.getPairs();
                }
                catch(error) {
                    console.error(`Error while adding pair to group: ${error}`);
                }
            }
        },
        components: {
            TempPairItem
        }
    }
</script>