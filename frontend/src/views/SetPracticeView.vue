<template>
    <div id="flags" class="absolute z-0 w-full h-full flex items-center overflow-hidden justify-center">
        <div class="max-w-[1000px] w-full absolute h-full bg-slate-900 z-0">
            <img src="/src/assets/flags/russia.svg" class="h-1/3 rotate-[20deg] -left-48 absolute bottom-1/2 opacity-10">
            <img src="/src/assets/flags/poland.svg" class="h-1/3 -right-48 absolute rotate-[20deg] top-1/2 opacity-10">
        </div>
    </div>

    <div id="main" class="flex flex-col w-full h-dvh z-10 max-w-[1000px] text-center">
        <form @submit.prevent="answered()" class="flex flex-col h-full max-h-full items-center justify-center clampGap font-raleway">
            <div class="flex gap-4 flagBox">
                <img src="/src/assets/flags/russia.svg" class="w-full box flag">
                <img src="/src/assets/flags/poland.svg" class="w-full box flag">
            </div>

            <div class="box boxClamp">
                <h1 class="font-bold paddingClamp rounded-3xl text-gray-50 bg-slate-900 w-full"> {{ current.word }} </h1>
            </div>

            <div class="flex flex-col clampGap items-center test px-1 mt-1" ref="inputContainer"> 
                <textarea 
                    @focus="active++" 
                    @blur="active--" 
                    @keydown.prevent.enter="answered()" 
                    @input="adjustHeight"
                    rows="1" 
                    type="text" 
                    ref="input" 
                    placeholder="translation" 
                    v-model="answer" 
                    :style="{height: dynamicHeight}"  
                    class="resize-none overflow-hidden placeholder-slate-500 w-full bg-slate-900 text-gray-50 font-extralight text-center inputBox boxClamp">
                </textarea>

                <div v-if="!answer" class="button flex mt-3 items-center justify-center rounded-3xl bg-slate-700 h-12 w-40 font-bold text-slate-500 text-2xl"> Check </div>
                <div v-else class="p-1 border-b-4 border-gray-50 rounded-full font-bold text-slate-900 text-2xl"> 
                    <button type="submit" class="button flex justify-center items-center rounded-3xl h-12 w-40 bg-gray-50 outline-gray-50 focus:outline-2 outline-offset-4"> Check </button>
                </div>
            </div>
        </form>
    </div>

    <footer class="w-full max-w-[1000px] h-2 bg-cyan-700 rounded-full absolute bottom-0"> 
        <div :style="{width: progressWidth}" class="h-2 bg-cyan-300 rounded-full transition-all"></div>
    </footer>
</template>

<script>
    import axios from 'axios';

    const BASE_API = 'http://192.168.125.199:3000/api';

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
                progressWidth: 0,
                pairAmount: null,
                correctPairs: [],
                active: false,
                dynamicHeight: null
            }
        },
        async mounted() {
            await Promise.all([this.getSet(), this.getPairs(), this.getLanguages()]);
            this.pairAmount = this.pairs.length;
            this.pickPair();
            this.adjustHeight();
            window.addEventListener('resize', this.adjustHeight);
        },
        destroyed() {
            window.removeEventListener('resize', this.adjustHeight);
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
                    this.progressWidth = this.correctPairs.length / this.pairAmount * 100 + '%';
                }

                if(this.correctPairs.length != this.pairAmount) this.pickPair();

                this.answer = '';
                this.adjustHeight();
            },
            adjustHeight: function() { 
                const input = this.$refs.input;
                const resizable = document.createElement('textarea'); 
                resizable.classList = input.classList;
                resizable.value = input.value;
                this.$refs.inputContainer.appendChild(resizable);

                resizable.style.height += 'px';
                this.dynamicHeight = `${resizable.scrollHeight}px`;
                resizable.remove();
            }
        }
    }
</script>

<style>
    :root{
        --box-frame: #334155;
    }

    .box{
        padding: 4px;
        border-radius: 24px;
        border-bottom: 4px solid var(--box-frame);
        outline: 2px solid var(--box-frame);
    }
    .flag{
        padding: clamp(4px, 1.5vw, 8px) !important;
        border-radius: clamp(16px, 5vw, 24px) !important;
    }
    .inputBox{
        border-radius: 24px;
        border-bottom: 4px solid var(--box-frame);
        outline: 2px solid var(--box-frame);
        outline-offset: 4px;
        box-sizing: border-box;
        padding: clamp(6px, 5vw, 20px);
    }
    .inputBox:focus,
    .inputBox:not(:placeholder-shown) {
        outline-color: white;
        border-color: white;
    }
    .boxClamp{
        width: clamp(100px, 80vw, 400px);
        font-size: clamp(10px, 6vw, 30px);
    }
    .button{
        width: clamp(80px, 32vw, 160px);
        font-size: clamp(8px, 5vw, 24px);
        height: clamp(30px, 10vw, 48px)
    }
    .flagBox{
        width: clamp(100px, 50vw, 240px);
    }
    .clampGap{
        gap: clamp(6px, 4vh, 40px)
    }
    .paddingClamp{
        padding: clamp(6px, 5vw, 24px);
    }
</style>