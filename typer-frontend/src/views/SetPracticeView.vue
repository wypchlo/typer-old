<template>
    <header id="container" class="flex justify-center w-full h-8 mt-4">
        <div class=" w-11/12 h-full bg-gray-300 rounded-full">
            <div :style="`width: ${pBarWidth}%`" class="h-full bg-gray-400 rounded-full transition-all"></div>
        </div>
    </header>
    
    <div class="flex flex-col mt-6 justify-center items-center gap-4">
        <div class="flex flex-col items-center justify-around my-2 h-60 w-60 text-center pt-2 bg-gray-100 rounded-xl"> 
            <h1 class="text-2xl font-medium"> {{ current.word }} </h1>
        </div>

        <div @submit.prevent="answered()" class="flex flex-col items-center justify-center p-6 text-center bg-gray-100 rounded-xl"> 
            <form> 
                <input type="text" v-model="answer" class="rounded-sm w-60 h-10 text-center text-2xl font-medium">
            </form>
        </div> 
    </div>
</template>

<script>
    import axios from 'axios';

    const BASE_API = 'http://localhost:3000/api';

    export default {
        data() {
            return {
                setId: this.$route.params.id,
                set: {},
                pairs: [],
                langs: [],
                idLangs: {},

                answer: null,
                current: {},
                currentIndex: null,
                pBarWidth: 0,
                pairAmount: null,
                correctPairs: []
            }
        },
        async mounted() {
            await Promise.all([this.getSet(), this.getPairs(), this.getLanguages()]);
            this.pairAmount = this.pairs.length;
            this.pickPair();
        },
        methods: {
            getPairs: async function() {
                const { data } = await axios.get(`${BASE_API}/pairs/set/${this.setId}`);
                this.pairs = data;
            },
           getSet: async function() {
                const { data } = await axios.get(`${BASE_API}/sets/${this.setId}`);
                this.set = data;
            },
            getLanguages: async function() {
                const { data } = await axios.get(`${BASE_API}/languages`);
                this.langs = data;
                for(let lang of data) this.idLangs[lang._id] = lang.language;
            },


            pickPair: function() {
                const pairIndex = Math.floor(Math.random() * this.pairs.length);
                this.current = this.pairs[pairIndex];
                this.currentIndex = pairIndex;
            },
            answered: function() {
                if(this.answer == null) return this.pickPair();

                const answer = this.answer.toLowerCase().trim();
                const translation = this.current.translation.toLowerCase().trim();
                const correct = (answer == translation);
                
                if(correct) {
                    this.correctPairs.push(this.current);
                    this.pairs.splice(this.currentIndex, 1);
                    this.pBarWidth = this.correctPairs.length / this.pairAmount * 100;
                }
                
                this.answer = null;
                if(this.correctPairs.length != this.pairAmount) this.pickPair();
            }
        }
    }
</script>