<template>
    <div>
        {{ groupId }}
    </div>
</template>

<script>
    export default {
        computed: {
            groupId() {
                return this.$route.params.id;
            }
        }
    }
</script>