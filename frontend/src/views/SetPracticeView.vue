<template> 
    <header class="justify-center mx-auto text-4xl flex gap-2 p-6">
            <h1 class="font-raleway text-gray-50 font-bold"> {{ set.name }} </h1>
            <p class="font-raleway text-gray-50 font-extralight"> {{ set.description }} </p>
    </header>
    
    <div class="bg-slate-900 h-full w-full">
        <form @submit.prevent="answered()" class="flex flex-col flex-wrap justify-center items-center gap-10 h-full text-center font-raleway pb-24"> 
        
            <div class="flex flex-col items-center justify-around h-96 w-96 break-all text-wrap rounded-3xl border-b-4 border-grayblue outline-slate-700 outline outline-2">
                <h1 class="text-3xl font-bold text-gray-50"> {{ current.word }} </h1>
                <img src="/src/assets/flags/poland.svg" class="w-40 rounded-3xl border-4 border-gray-50">
            </div>
            
            <div class="flex flex-col gap-4 items-center" ref="cooldiv"> 
                <textarea @keyup.enter="answered()" type="text" v-model="answer" ref="input" @keyup="adjustHeight" placeholder="translation" class="resize-none py-8 px-6 h-24 overflow-hidden placeholder-gray-400 w-96 align-middle text-2xl bg-transparent text-raleway text-gray-50 font-extralight flex flex-col items-center justify-center pe2 text-center bg-item rounded-3xl border-b-4 border-itemborder outline outline-itemborder focus:outline-gray-50 focus:outline-2 focus:outline-offset-4 focus:border-gray-50"></textarea>
                <button type="submit" class="rounded-3xl w-fit py-2 px-12 bg-gray-50 font-bold text-slate-900 text-3xl outline-gray-50 focus:outline-2 outline-offset-4"> check </button>
            </div>
        </form>
    </div>      

    <footer id="container" class="w-full h-2 bg-cyan-700 rounded-full absolute bottom-0"> 
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
            },
            adjustHeight: function(event) {
                if(event.key == 'Enter') return;
                
                try{ document.body.querySelector('#dupa').remove();}
                catch(error) {  }

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