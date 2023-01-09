<template>
  <header>
      <HeaderName msg="Dienpinigiai" />
  </header>
    <main>
        <BodyDienpinigiai></BodyDienpinigiai>
  </main>
</template>

<script setup>
    import HeaderName from "@/components/HeaderName.vue";
    import BodyDienpinigiai from "../components/BodyDienpinigiai.vue";

    

</script>

<style scoped>
  header, main{
    color: #41A1E4;
    /* text-shadow: 1px 0 0 #41A1E4, 0 -1px 0 #41A1E4, 0 1px 0 #41A1E4, -1px 0 0 #41A1E4;  */
    -webkit-user-select:none;
    -moz-user-select:none;
    user-select:none;
  }
</style>