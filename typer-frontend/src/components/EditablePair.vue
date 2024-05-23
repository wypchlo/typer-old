<template>
    <form @submit.prevent="passPair()" class="flex flex-col justify-around my-2 h-60 w-60 text-center pt-2 bg-gray-100 rounded-xl"> 
        <div>
            <input type="text" v-model="pair.word" placeholder="word" class="bg-gray-100 text-2xl font-medium text-center w-full">
            <select v-model="pair.wordLanguageId" class="text-center bg-gray-100 text-gray-500">
                <option disabled selected :value="undefined"> Select a language </option>
                <option v-for="lang in langs" :key="lang" :value="lang._id"> {{ lang.language }} </option>
            </select>
        </div>

        <div>
            <input type="text" v-model="pair.translation" placeholder="translation" class="text-2xl font-medium bg-gray-100 text-center w-full">
            <select v-model="pair.translationLanguageId" class="text-center bg-gray-100 text-gray-500">
                <option disabled selected :value="undefined"> Select a language </option>
                <option v-for="lang in langs" :key="lang" :value="lang._id" selected=""> {{ lang.language }} </option>
            </select>
        </div>

        <button type="submit"> Confirm </button>
    </form>
</template>

<script>
    export default {
        props: [
            'pair',
            'langs'
        ],
        methods: {
            passPair: function() {
                this.$emit('confirmed', this.pair);
            }
        }
    }
</script>