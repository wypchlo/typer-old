<template>
    <div v-if="group">
        <header class="text-center py-6">
            <h1 class="text-4xl font-medium"> {{ group.name }} </h1>
            <p class="font-light text-2xl"> {{ group.description }} </p>
        </header>
        <hr>
        <section class="text-center py-6 flex flex-col items-center">
            <h1 class="text-3xl font-medium py-6"> Pairs </h1>

            <div v-if="pairs.length" id="wordContainer" class="flex-col">
                <PairItem v-for="(pair, index) in pairs" :key="pair" :pair="pair" class="flex flex-col justify-center py-6 px-10 my-2 bg-gray-200 rounded-xl">
                    <h1 class="text-2xl font-medium"> {{ pair.word }} </h1>
                    <hr>
                    <h1 class="text-2xl font-medium"> {{ pair.translation }} </h1>
                </PairItem>
            </div>
            <div v-else class="py-6">
                <h1 class="text-2xl font-light"> This group has no pairs </h1>
            </div>
            
            <TempPairItem v-if="tempPair" :groupId="group['_id']"> 
            
            </TempPairItem>

            <button class="text-2xl p-6 border" @click="addPair()"> Add a pair </button>
        </section>
    </div>
</template>

<script>
    import axios from 'axios';
    import TempPairItem from '../components/TempPairItem.vue';
    import PairItem from '../components/PairItem.vue';

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
            getDetails: async function() {
                const group = await axios.get(`http://localhost:3000/api/groups/${this.$route.params.id}`);
                this.group = group.data;

                const pairs = await axios.get(`http://localhost:3000/api/pairs/group/${this.$route.params.id}`)
                this.pairs = pairs.data;
            },
            addPair: function() {
                this.tempPair = {}
            }
        },
        components: {
            TempPairItem,
            PairItem
        }
    }
</script>