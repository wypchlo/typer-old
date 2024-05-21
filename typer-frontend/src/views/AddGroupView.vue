<template>
    <div>
        <form @submit.prevent="handleSubmit()">
            <label> name: <input type="text" v-model="name"> </label> <br>
            <label> description: <input type="text" v-model="description"> </label> <br>
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
                name: null,
                description: null,
                status: null
            }
        },
        methods: {
            handleSubmit: async function(){
                try { 
                    const group = {
                        name: this.name,
                        description: this.description
                    }
                    await axios.post('http://localhost:3000/api/groups/add', group);
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