<template>
    <div>
        <h1> {{ index }}. {{ documentInfo.name }} </h1>
        <button @click="deleteItem()"> Delete </button>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        methods: {
            deleteItem: async function(){
                const groupId = this.documentInfo['_id'];
                await axios.post('http://localhost:3000/api/groups/delete', { 'groupId': groupId });
            }
        },
        props: [
            'documentInfo',
            'index'
        ]
    }
</script>