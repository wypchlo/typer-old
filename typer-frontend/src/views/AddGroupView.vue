<template>
    <div>
        <form @submit.prevent="handleSubmit()">
            <label> Group name: <input type="text" v-model="groupName"> </label>
            <input type="submit">
        </form>
        <div ref="status"> {{ status }} </div>
    </div>
    <h1> <button @click="goBack()"> go back </button> </h1>
</template>

<script>
    import axios from 'axios';

    export default{
        data() {
            return {
                groupName: null,
                status: null
            }
        },
        methods: {
            handleSubmit: async function(){
                try { 
                    await axios.post('http://localhost:3000/api/groups/add', { groupName: this.groupName });
                    this.status = 'sent';
                }
                catch(error) {
                    console.log(error);
                }
            },
            goBack(){
                this.$router.go(-1);
            }
        }
    }
</script>