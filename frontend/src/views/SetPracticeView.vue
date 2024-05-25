<template>
    <div id="flags" class="absolute z-0 w-full h-full flex items-center overflow-hidden justify-center">
        <div class="max-w-[1000px] w-full absolute h-full bg-slate-900 z-0">
            <img src="/src/assets/flags/russia.svg" class="h-1/3 rotate-[20deg] -left-48 absolute bottom-1/2 opacity-10">
            <img src="/src/assets/flags/poland.svg" class="h-1/3 -right-48 absolute rotate-[20deg] top-1/2 opacity-10">
        </div>
    </div>

    <div id="main" class="flex flex-col w-full h-screen z-10 max-w-[1000px] text-center">
        <header class="flex flex-wrap justify-center gap-2 py-10 font-raleway text-center">
            <h1 class="font-bold text-4xl text-gray-50"> {{ set.name }} </h1>
        </header>

        <form @submit.prevent="answered()" class="flex flex-1 flex-col max-h-full items-center justify-center gap-10 w-full flex-wrap px-6 font-raleway">
            <div class="flex gap-4 min-w-44 max-w-96">
                <img src="/src/assets/flags/russia.svg" class="w-28 border-b-4 border-slate-700 rounded-3xl outline outline-2 outline-slate-700 p-2">
                <img src="/src/assets/flags/poland.svg" class="w-28 border-b-4 border-slate-700 rounded-3xl outline outline-2 outline-slate-700 p-2">
            </div>

            <div class="flex flex-col items-center justify-around min-w-48 max-w-96 border-slate-700 w-full break-all rounded-3xl border-b-4 outline-slate-700 outline outline-2 p-1">
                <h1 class="text-3xl font-bold text-gray-50 bg-slate-900 w-full h-full rounded-3xl py-10"> {{ current.word }} </h1>
            </div>

            <div class="flex flex-col gap-10 items-center min-w-44 max-w-96" ref="cooldiv"> 
                <textarea @focus="active++" @blur="active--" @keydown.prevent.enter="answered()" type="text" v-model="answer" ref="input" @input="adjustHeight" placeholder="translation" class="resize-none py-8 px-6 h-24 overflow-hidden placeholder-slate-500 w-full text-2xl bg-slate-900 text-gray-50 font-extralight text-center rounded-3xl border-b-4 border-slate-700 outline outline-2 outline-slate-700 focus:outline-gray-50 focus:outline-2 outline-offset-4 focus:border-gray-50"></textarea>
                <div v-if="!answer" class="rounded-3xl mt-3 bg-slate-700 py-2 px-12 font-bold text-slate-500 text-2xl outline-gray-50 focus:outline-2 outline-offset-4"> Check </div>

                <div v-else class="p-1 border-b-4 border-gray-50 rounded-full"> 
                    <button type="submit" class="rounded-3xl py-2 px-12 bg-gray-50 font-bold text-slate-900 text-2xl outline-gray-50 focus:outline-2 outline-offset-4"> Check </button>
                </div>
            </div>
        </form> 
    </div>

    <footer id="container" class="w-full max-w-[1000px] h-2 bg-cyan-700 rounded-full absolute bottom-0"> 
        <div :style="`width: ${pBarWidth}%`" class="h-2 bg-cyan-300 rounded-full transition-all"></div>
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
                correctPairs: [],
                active: false
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

                this.$refs.input.value = '';
                this.adjustHeight();
            },
            adjustHeight: function(event) { 
                const input = this.$refs.input;
                const resizable = document.createElement('textarea');
                
                resizable.id = 'dupa';
                resizable.classList = input.classList;
                resizable.value = input.value;
                this.$refs.cooldiv.appendChild(resizable);
                resizable.style.height = resizable.scrollHeight + 'px';

                input.style.height = `${resizable.scrollHeight}px`
                resizable.remove();
            }
        }
    }
</script>