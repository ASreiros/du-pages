<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
});
</script>

<template>
    <h1 class="project-name">{{ msg }}</h1>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  text-align: center;
  color: darkblue;
}


</style>
