<template>
    <form @submit.prevent="handleSubmit()" class=" bg-gray-50 flex flex-col w-fit h-fit p-6"> 
        <label> word: <input type="text" v-model="word"> </label>        
        <label> translation: <input type="text" v-model="translation"> </label>

        <button type="submit"> Confirm </button>
    </form>
</template>

<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                word: null,
                translation: null,
                wordLanguageId: null,
                translationLanguageId: null
            }
        },
        methods: {
            handleSubmit: async function() {
                const {word, translation, wordLanguageId, translationLanguageId, groupId} = this;

                console.log(this.groupId);

                await axios.post('http://localhost:3000/api/pairs/add', {
                   word, 
                   translation,
                   wordLanguageId,
                   translationLanguageId,
                   groupId 
                })
            }
        },
        props: [
            'groupId'
        ]
    }
</script>