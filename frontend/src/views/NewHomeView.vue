                @mousedown="handleClick('start', index)" 
                @mouseup="handleClick('stop', index)"

<template>
    <section class="flex flex-col justify-center items-center max-w-[1000px] w-full h-full bg-slate-900 gap-10">
        <div class="flex items-end gap-6">
            <button @click="mode = 'add'" class="text-gray-50 rounded-full w-20 h-20 input">
                <addCardsIcon class="h-full w-full"></addCardsIcon>
            </button>
            <button @click="handleDelete" class="text-gray-50 rounded-full w-20 h-20 input">
                <removeIcon class="h-full w-full"></removeIcon>
            </button>
        </div>
        <div class="flex gap-10 flex-wrap justify-center items-center font-raleway">
            <form v-if="mode == 'add'" @submit.prevent="handleAdd" class="text-center flex flex-col text-gray-50 justify-center items-center bg-slate-900 h-60 w-40 border-b-4 rounded-3xl outline outline-2 outline-slate-700 border-slate-700">
                <input placeholder="name" v-model="tempSet.name" class="bg-slate-900 w-full font-bold text-center text-2xl outline-none placeholder-slate-600">
                <input placeholder="description" v-model="tempSet.description" class="bg-slate-900 w-full font-light text-center outline-none placeholder-slate-500">
                <div v-if="!tempSet.name" class="rounded-full font-bold text-slate-500 bg-slate-700 w-20 mt-2"> confirm </div>
                <button v-else type="submit" class="rounded-full font-bold text-slate-900 bg-gray-50 w-20 mt-2"> confirm </button>
            </form>

            <button v-for="(set, index) in sets" 
                @mouseup="handleClick('mStop', index)"
                @mousedown="handleClick('mStart', index)"
                @mouseleave="handleClick('mOut', index)"

                @touchstart="handleClick('tStart', index)"
                @touchend="handleClick('tStop', index)"
                @touchmove="handleClick('tMove', index)"
                class="transition-transform text-center relative select-none flex flex-col text-gray-50 justify-center items-center bg-slate-900 h-60 w-40 border-b-4 rounded-3xl outline outline-2"
                :class="buttonClass(set)">

                <h1 class="font-raleway font-bold text-gray-50 text-2xl break-all"> {{ set.name }} </h1>
                <h4 class="font-raleway font-light text-gray-50 text-sm break-all"> {{ set.description }} </h4>
                <p id="cardsAmount" class="flex font-extrabold gap-2 text-xl mt-2"><cardsIcon class="text-2xl text-white"> </cardsIcon> 200 </p>
                <div v-if="mode == 'select'" id="selectCirlce" class="border-2 rounded-full border-slate-900 outline outline-2 h-6 w-6 absolute -top-[6px] -right-[6px]" :class="set.selected ? 'outline-gray-50 bg-gray-50' : 'outline-slate-700 bg-slate-900'"></div>
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
                sets: [],
                selected: [],

                tempSet: { name: null, description: null },

                mode: 'normal',
                click: { time: 0, interval: null, type: 'mouse', moved: false, selected: false }
            }
        },
        async mounted() {
            this.sets = await this.getSets();
        },
        watch: {
            mode(newVal, oldVal){
                if(newVal != 'select') {
                    for( let index in this.selected ) 
                        this.sets[this.selected[index]].selected = false;
                    this.selected = [];
                };
            }
        },
        methods: {
            handleDelete: async function() {
                if(this.mode != 'select') return this.mode = 'select';
                if(!this.selected.length) return this.mode = 'normal';

                const ids = this.selected.map(index => this.sets[index]);
                this.deleteSets(ids);

                this.sets = this.sets.filter(set => !set.selected);
                this.selected = [];
                this.mode = 'normal';
            },
            handleAdd: async function() {
                await this.addSet(this.tempSet);
                this.sets = await this.getSets();
                this.tempSet = { name: null, description: null };
                this.mode = 'normal';
            },
            handleClick(state, index) {
                if(state == 'mStop') this.click.type = 'mouse';
                if(state == 'tStart') this.click.type = 'touch';

                console.log(state);

                if(this.click.type == 'touch'){
                    switch (state) {
                        case 'tStart':
                            if(this.click.interval) break;

                            this.click.interval = setInterval(() => {
                                this.click.time++;

                                if(this.click.moved) return this.sets[index].held = false;
                                this.sets[index].held = true;

                                if(this.click.time == 3 && this.mode != 'select') {
                                    this.sets[index].selected = true;
                                    this.selected.push(index);
                                    this.click.selected = true;
                                    this.mode = 'select';
                                }
                            }, 100);
                            break;
                        
                        case 'tMove':
                            this.click.moved = true;
                            break;

                        case 'tStop':
                            clearInterval(this.click.interval); 

                            if(this.mode == 'select' && !this.click.selected) {
                                if(!this.click.moved){
                                    this.sets[index].selected = !this.sets[index].selected;
                                    const indexOf = this.selected.indexOf(index);
                                    (indexOf === -1) ? this.selected.push(index) : this.selected.splice(indexOf, 1)
                                }
                            }

                            else if(this.click.time < 1 && !this.click.moved) this.$router.push({ name: 'SetDetails', params: { id: this.sets[index]._id } })

                            if(!this.selected.length) this.mode = 'normal';

                            Object.assign(this.click, { interval: null, time: 0, moved: false, selected: false });
                            this.sets[index].held = false;
                            break;
                    }
                }

                if(this.click.type == 'mouse'){
                    switch (state) {
                        case 'mStart':
                            if(this.click.interval) break;

                            this.click.interval = setInterval(() => {
                                this.click.time++;

                                if(this.click.moved) return this.sets[index].held = false;
                                this.sets[index].held = true;

                                if(this.click.time == 3 && this.mode != 'select') {
                                    this.sets[index].selected = true;
                                    this.selected.push(index);
                                    this.click.selected = true;
                                    this.mode = 'select';
                                }
                            }, 100);
                            break;
                        
                        case 'mOut':
                            if(this.click.interval){
                                clearInterval(this.click.interval); 

                                if(this.mode == 'select' && !this.click.selected) {
                                    if(!this.click.moved){
                                        this.sets[index].selected = !this.sets[index].selected;
                                        const indexOf = this.selected.indexOf(index);
                                        (indexOf === -1) ? this.selected.push(index) : this.selected.splice(indexOf, 1)
                                    }
                                }

                                else if(this.click.time < 1 && !this.click.moved) this.$router.push({ name: 'SetDetails', params: { id: this.sets[index]._id } })

                                if(!this.selected.length) this.mode = 'normal';

                                Object.assign(this.click, { interval: null, time: 0, moved: false, selected: false });
                                this.sets[index].held = false;
                                break;  
                            }
                            break;

                        case 'mStop':
                            if(!this.click.interval) break;
                            clearInterval(this.click.interval); 

                            if(this.mode == 'select' && !this.click.selected) {
                                if(!this.click.moved){
                                    this.sets[index].selected = !this.sets[index].selected;
                                    const indexOf = this.selected.indexOf(index);
                                    (indexOf === -1) ? this.selected.push(index) : this.selected.splice(indexOf, 1)
                                }
                            }

                            else if(this.click.time < 1 && !this.click.moved) this.$router.push({ name: 'SetDetails', params: { id: this.sets[index]._id } })

                            if(!this.selected.length) this.mode = 'normal';

                            Object.assign(this.click, { interval: null, time: 0, moved: false, selected: false });
                            this.sets[index].held = false;
                            break;  
                    }
                }
            },
            buttonClass(set) {
                let classes = '';
                classes += set.selected ? 'outline-gray-50 border-gray-50 scale-95' : 'outline-slate-700 border-slate-700';
                if(set.held) classes += ' scale-95';
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

    .input{
        border-bottom: 4px solid var(--box-frame);
        outline: 2px solid var(--box-frame);
        outline-offset: 4px;
        padding: 16px;
    }

    .input:hover{
        outline-color: var(--selected);
        border-color: var(--selected);
    }

    .input:active{
        border-bottom: 0px solid white !important;
        height: calc(100% - 4px);
    }

    a, input, button
{
    touch-action: manipulation;
}            
</style>