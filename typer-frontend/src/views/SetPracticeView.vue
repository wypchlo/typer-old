<template>
    <header id="container" class="flex justify-center w-full h-8 mt-4">
        <div class=" w-11/12 h-full bg-gray-300 rounded-full">
            <div :style="`width: ${pBarWidth}%`" class="h-full bg-gray-400 rounded-full transition-all"></div>
        </div>
    </header>
    <div> {{ pairs.length }} </div>
    <button @click="correctAnswer()"> Progress </button>
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

                pBarWidth: 0,
                pairAmount: null,
                correct: []
            }
        },
        async mounted() {
            await Promise.all([this.getSet(), this.getPairs(), this.getLanguages()]);
            this.pairAmount = this.pairs.length;
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
            correctAnswer: function() {
                this.correct.push(this.pairs[0]);
                this.pBarWidth = this.correct.length / this.pairAmount * 100;
            }
        }
    }
</script>