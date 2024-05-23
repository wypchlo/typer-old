<template>
    <form @submit.prevent="passPair()" class="flex flex-col justify-around h-60 w-60 text-center bg-gray-100 rounded-xl"> 
        <div class="flex flex-col justify-around h-full">
            <div class="flex flex-col">
                <input type="text" v-model="pair.word" placeholder="word" class="bg-gray-100 text-2xl font-medium text-center w-full">
                <select v-model="pair.wordLanguageId" class="text-center bg-gray-100 text-gray-500">
                    <option disabled selected :value="undefined"> Select a language </option>
                    <option v-for="lang in langs" :key="lang" :value="lang._id"> {{ lang.language }} </option>
                </select>

                <br>

                <input type="text" v-model="pair.translation" placeholder="translation" class="text-2xl font-medium bg-gray-100 text-center w-full">
                <select v-model="pair.translationLanguageId" class="text-center bg-gray-100 text-gray-500">
                    <option disabled selected :value="undefined"> Select a language </option>
                    <option v-for="lang in langs" :key="lang" :value="lang._id" selected=""> {{ lang.language }} </option>
                </select>
            </div>
            
            <div class="flex gap-4 justify-center">
                <button type="submit" class="h-6 w-6"><img src="/src/assets/icons/check.svg" class="h-full w-full"></button>
            </div>
        </div>
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