<template>
    <section class="flex flex-col items-center max-w-[1000px] w-full h-full bg-slate-900 gap-10">
        <header class="h-60 py-10 gap-4 w-full flex flex-col justify-between items-center text-gray-50 font-raleway">
            <div class="flex flex-col justify-center gap-4 items-center">
                <h1 class="text-3xl uppercase font-bold"> {{ set.name }} </h1>
                <p class="font-extralight text-2xl"> {{ set.description }} </p>
            </div>
            <router-link :to="{name: 'SetPractice', params: { id: set._id }}" class="p-1 h-13 box-border border-b-4 border-gray-50 rounded-full active:border-b-0">
                <div class="bg-gray-50 px-8 py-1 rounded-full text-slate-900 font-bold text-2xl"> practice </div>
            </router-link>
        </header>
        <div class="flex flex-col justify-center items-center gap-10">
            <div class="flex items-end gap-10 h-20">
                <button @click="mode = (mode == 'add') ? 'normal' : 'add'" class="text-gray-50 flex items-center jusitfy-center rounded-full w-20 h-20 homeInput">
                    <addCardsIcon class="h-20 w-full"></addCardsIcon>
                </button>
                <button @click="handleDelete" class="text-gray-50 flex items-center justify-center rounded-full w-20 h-20 homeInput">
                    <removeIcon class="h-20 w-full"></removeIcon>
                </button>
            </div>
            <div class="flex gap-10 flex-wrap justify-center items-center font-raleway">
                <form v-if="mode == 'add'" @submit.prevent="handleAdd" class="text-center flex flex-col text-gray-50 justify-center items-center bg-slate-900 h-40 w-96 border-b-4 rounded-3xl outline outline-2 outline-slate-700 border-slate-700">
                    <input placeholder="word" v-model="tempPair.word" class="bg-slate-900 w-full font-bold text-center text-2xl outline-none placeholder-slate-600">
                    <input placeholder="translation" v-model="tempPair.translation" class="bg-slate-900 w-full font-light text-center outline-none placeholder-slate-500">
                    <div v-if="!(tempPair.word && tempPair.translation)" class="rounded-full font-bold text-slate-500 bg-slate-700 w-20 mt-2"> confirm </div>
                    <button v-else type="submit" class="rounded-full font-bold text-slate-900 bg-gray-50 w-20 mt-2"> confirm </button>
                </form>

                <button v-for="(pair, index) in pairs" 
                    @mouseup="handleClick('mStop', index)"
                    @mousedown="handleClick('mStart', index)"
                    @mouseleave="handleClick('mOut', index)"

                    @touchstart="handleClick('tStart', index)"
                    @touchend="handleClick('tStop', index)"
                    @touchmove="handleClick('tMove', index)"
                    class="transition-transform text-left relative select-none flex flex-col text-gray-50 justify-center items-center bg-slate-900 h-[152px] w-96 border-b-4 rounded-3xl outline outline-2"
                    :class="buttonClass(pair)">
                    <div id="flags" class="w-full h-full absolute z-0 flex justify-center">
                        <img class="absolute w-1/2 left-0 h-full -bottom-[2px]" src="/src/assets/flags/poland.svg">
                        <img class="absolute w-1/2 right-0 h-full -bottom-[2px]" src="/src/assets/flags/france.svg">
                    </div>

                    <div class="z-10 w-full h-full rounded-3xl p-1 relative">
                        <div class="bg-slate-900 bg-opacity-100 w-full h-full rounded-3xl justify-center items-center flex flex-col">
                            <h1 class="flex gap-4 font-raleway font-bold text-gray-50 text-2xl break-all"> {{ pair.word }} </h1>
                            <h4 class="flex gap-4 font-raleway font-light text-gray-50 text-sm break-all"> {{ pair.translation }} </h4>
                        </div>
                    </div>


                    <div v-if="mode == 'select'" id="selectCirlce" class="z-20 border-2 rounded-full border-slate-900 outline outline-2 h-6 w-6 absolute -top-[6px] -right-[6px]" :class="pair.selected ? 'outline-gray-50 bg-gray-50' : 'outline-slate-700 bg-slate-900'"></div>
                </button>
            </div>
        </div>
    </section>
</template>

<script>
    import cardsIcon from '../components/Icons/cards.vue';
    import addCardsIcon from '../components/Icons/addCards.vue';
    import removeIcon from '../components/Icons/remove.vue';
    import axiosFetches from '../mixins/axiosFetches';

    export default{
        mixins: [
            axiosFetches
        ],
        data() {
            return {
                set: { _id: this.$route.params.id },
                pairs: [],
                selected: [],

                tempPair: { word: null, translation: null },

                mode: 'normal',
                click: { time: 0, interval: null, type: 'mouse', moved: false, selected: false }
            }
        },
        async mounted() {
            this.set = await this.getSet(this.set._id); 
            this.pairs = await this.getSetPairs(this.set._id);
        },
        watch: {
            mode(newVal, oldVal){
                if(newVal != 'select') {
                    for( let index in this.selected ) 
                        this.pairs[this.selected[index]].selected = false;
                    this.selected = [];
                };
            }
        },
        methods: {
            handleDelete: async function() {
                if(this.mode != 'select') return this.mode = 'select';
                if(!this.selected.length) return this.mode = 'normal';

                const ids = this.selected.map(index => this.pairs[index]);
                this.deletePairs(ids);

                this.pairs = this.pairs.filter(pair => !pair.selected);
                this.selected = [];
                this.mode = 'normal';
            },
            handleAdd: async function() {
                Object.assign(this.tempPair, { setId: this.set._id });
                await this.addPair(this.tempPair);
                this.pairs = await this.getSetPairs(this.set._id);
                this.tempPair = { word: null, translation: null };
                this.mode = 'normal';
            },
            handleClick(state, index) {
                if(state == 'mStop') this.click.type = 'mouse';
                if(state == 'tStart') this.click.type = 'touch';

                const handleStart = () => {
                    if (this.click.interval) return;

                    this.click.interval = setInterval(() => {
                        this.click.time++;

                        if (this.click.moved) return this.pairs[index].held = false;
                        this.pairs[index].held = true;

                        if (this.click.time === 3 && this.mode !== 'select') {
                            this.pairs[index].selected = true;
                            this.selected.push(index);
                            this.click.selected = true;
                            this.mode = 'select';
                        }
                    }, 100);
                };

                const handleStop = () => {
                    if(!this.click.interval) return;

                    clearInterval(this.click.interval);

                    if (this.mode === 'select' && !this.click.selected) {
                        if (!this.click.moved) {
                        this.pairs[index].selected = !this.pairs[index].selected;
                        const indexOf = this.selected.indexOf(index);
                        indexOf === -1 ? this.selected.push(index) : this.selected.splice(indexOf, 1);
                        }
                    } 
                    else if (this.click.time < 1 && !this.click.moved) {
                        this.$router.push({ name: 'SetDetails', params: { id: this.pairs[index]._id } });
                    }

                    if (!this.selected.length) this.mode = 'normal';

                    Object.assign(this.click, { interval: null, time: 0, moved: false, selected: false });
                    this.pairs[index].held = false;
                };

                if (this.click.type === 'touch') {
                    switch (state) {
                        case 'tStart':
                            handleStart();
                            break;
                        case 'tMove':
                            this.click.moved = true;
                            break;
                        case 'tStop':
                            handleStop();
                            break;
                    }
                }

                if (this.click.type === 'mouse') {
                    switch (state) {
                        case 'mStart':
                            handleStart();
                            break;
                        case 'mOut':
                        case 'mStop':
                            handleStop();
                            break;
                    }
                }
            },
            buttonClass(pair) {
                let classes = '';
                classes += pair.selected ? 'outline-gray-50 border-gray-50 scale-95' : 'outline-slate-700 border-slate-700';
                if(pair.held) classes += ' scale-95';
                return classes;
            }
        },
        components: {
            cardsIcon,
            addCardsIcon,
            removeIcon
        }
    }
</script>

<style>
    :root{
        --box-frame: theme(colors.slate.700);
        --selected: theme(colors.gray.50);
    }

    .homeInput{
        border-bottom: 4px solid var(--box-frame);
        outline: 2px solid var(--box-frame);
        outline-offset: 4px;
        padding: 16px;
        transition: height .1s ease;
    }

    .homeInput:hover{
        outline-color: var(--selected);
        border-color: var(--selected);
    }

    .homeInput:active{
        border-bottom: 0px solid white !important;
        height: calc(100% - 4px);
    }

    a, input, button
    {
        touch-action: manipulation;
    }            
</style>