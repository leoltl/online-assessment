<template>
  <div class="tag">
      {{ tagName }}
  </div>
</template>

<script>
export default {
    name: "Tag",
    props: ["tagName"]
}
</script>

<style>
.tag {
    background: #bbb;
    margin: 0.2rem;
    padding: 0.4rem;
    border-radius: 3px;
}
</style>