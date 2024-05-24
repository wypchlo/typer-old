<template> 
    <header class="flex justify-center w-full h-20 items-center">
        <div class="flex gap-4 text-4xl">
            <h1 class="font-raleway text-gray-50 font-bold"> {{ set.name }} </h1>
            <p class="font-raleway text-gray-50 font-extralight"> {{ set.description }} </p>
        </div>
    </header>

    <div class="flex flex-col mt-6 justify-center items-center gap-4">
        <div class="flex flex-col items-center justify-around h-60 min-w-60 max-w-max text-center text-wrap pt-2 bg-slate-900 rounded-3xl border-4 border-slate-800 bg-sketch break-words"> 
            <h1 class="text-3xl font-bold font-raleway text-gray-50"> {{ current.word }} </h1>
        </div>

        <form @submit.prevent="answered()"> 
            <input type="text" v-model="answer" class="w-96 h-24 text-2xl bg-transparent text-raleway text-gray-50 font-extralight flex flex-col items-center justify-center p-2 text-center bg-slate-900 rounded-3xl border-4 border-slate-800">
        </form> 
    </div>

    <footer id="container" class="flex justify-center w-full h-8 mt-4">
        <div class=" w-full h-2 bg-cyan-700 rounded-full absolute bottom-0">
            <div :style="`width: ${pBarWidth}%`" class="h-full bg-cyan-300 rounded-full transition-all"></div>
        </div>
    </footer>
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