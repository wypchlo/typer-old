<template>
    <section class="flex flex-col justify-center items-center max-w-[1000px] w-full h-full bg-slate-900 gap-10">
        <div class="flex items-end gap-6">
            <button class="text-gray-50 rounded-full w-20 h-20 inputBox">
                <addCardsIcon class="h-full w-full"></addCardsIcon>
            </button>
            <button @click="handleDelete" class="text-gray-50 rounded-full w-20 h-20 inputBox">
                <removeIcon class="h-full w-full"></removeIcon>
            </button>
        </div>
        <div class="flex gap-10 flex-wrap justify-center items-center font-raleway">
            <form class="text-center flex flex-col text-gray-50 justify-center items-center bg-slate-900 h-60 w-40 border-b-4 rounded-3xl outline outline-2 outline-slate-700 border-slate-700">
                <input placeholder="name" class="bg-slate-900 w-full font-bold text-center text-2xl outline-none placeholder-slate-600">
                <input placeholder="description" class="bg-slate-900 w-full font-light text-center outline-none placeholder-slate-500">
                <button type="submit" class="rounded-full font-bold text-slate-900 bg-gray-50 w-20 mt-2"> confirm </button>
            </form>

            <button v-for="(set, index) in sets" 
                @mousedown="handleClick('start', index)" 
                @mouseup="handleClick('stop', index)" 
                @touchstart="handleClick('start', index)"
                @touchstop="handleClick('stop', index)"
                class="text-center flex flex-col text-gray-50 justify-center items-center bg-slate-900 h-60 w-40 border-b-4 rounded-3xl outline outline-2"
                :class="set.selected ? 'outline-gray-50 border-gray-50' : 'outline-slate-700 border-slate-700'">

                <h1 class="font-raleway font-bold text-gray-50 text-2xl break-all"> {{ set.name }} </h1>
                <h4 class="font-raleway font-light text-gray-50 text-sm break-all"> {{ set.description }} </h4>
                <p id="cardsAmount" class="flex font-extrabold gap-2 text-xl mt-2"><cardsIcon class="text-2xl text-white"> </cardsIcon> 200 </p>
            </button>
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
                mode: null,
                sets: [],
                selected: [],

                mode: 'normal',
                click: { time: 0, interval: null, holding: false }
            }
        },
        async mounted() {
            this.sets = await this.getSets();
        },
        methods: {
            handleDelete: async function() {
                if(!this.selected.length) return;

                const ids = [];
                for(let index in this.selected) ids.push(this.sets[index]);
                this.deleteSets(ids);

                this.sets = this.sets.filter(set => !set.selected);
            },
            handleClick(state, index) {
                switch (state) {
                    case 'start':
                        if(!this.click.holding){
                            if(this.selected.length) {
                                this.sets[index].selected = !this.sets[index].selected;
                                const indexOf = this.selected.indexOf(index);
                                (indexOf === -1) ? this.selected.push(index) : this.selected.splice(indexOf, 1);
                                break;
                            }
                            this.click.interval = setInterval(() => { 
                                this.click.time += 1;
                                if(this.click.time == 3) {
                                    this.sets[index].selected = true;
                                    this.selected.push(index);
                                } 
                            }, 100);
                        }
                        this.click.holding = true;
                        break;
                    case 'stop':
                        clearInterval(this.click.interval);
                        this.click.holding = false;
                        this.click.time = 0;
                        break;
                }
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

    .inputBox{
        border-bottom: 4px solid var(--box-frame);
        outline: 2px solid var(--box-frame);
        outline-offset: 4px;
        padding: 16px;
    }

    .inputBox:hover{
        outline-color: var(--selected);
        border-color: var(--selected);
    }

    .inputBox:active{
        border-bottom: 0px solid white !important;
        height: calc(100% - 4px);
    }
</style>