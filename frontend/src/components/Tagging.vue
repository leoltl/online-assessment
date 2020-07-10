<template>
  <div class="tagging">
      <div class="tag-wrapper">
        <Tag 
          v-for="tag in tags" 
          :tagName="tag" 
          :key="tag"
        />
      </div>
      <input 
        class="add-tag-input" 
        placeholder="Add a tag" 
        v-model="tagName" 
        v-on:keyup.enter="() => addTag(tagName)"
      />
  </div>
</template>

<script>
import { tagBus } from "../Eventbus";
import Tag from "./Tag.vue"
export default {
  name: 'Tagging',
  props: ["studentID", "tags"],
  components: {
    Tag
  },
  data() {
    return {
      tagName: ""
    }
  },
  methods: {
    addTag: function(tag) {
      // custom bus is used to emit addTag custom event to a grandparent component (App.vue), this can avoid 
      // having to create additional listeners to relay/reemit event up when more wrapping components are added in the future
      tagBus.$emit("addTag", {
        id: this.studentID,
        tag
      });
      this.tagName = "";
    }
  },
}
</script>

<style scoped>
.tag-wrapper {
  display: flex;
  flex-wrap: wrap;
  margin: 0.25rem 0;
}
</style>