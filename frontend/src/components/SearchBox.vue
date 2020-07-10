<template>
  <input 
    v-model="value"
    class="search" 
    :id="id" 
    :placeholder="'Search by ' + type"
    />
</template>

<script>
export default {
    name: "SearchBox",
    props: ["id", "type"],
    data() {
        return {
            value: "",
        }
    },
    watch: {
        value: function(val) {
            this.$emit("searchTermChange", val.trim(), this.type);
        }
    }
}
</script>

<style>

</style>