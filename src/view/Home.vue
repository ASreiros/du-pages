<script setup>
import CalculatorBody from "@/components/CalculatorBody.vue";
import HeaderName from "@/components/HeaderName.vue";
</script>

<template>
  <header>
      <HeaderName msg="Atlyginimo skaičiuoklė" />
  </header>

  <main>
    <CalculatorBody />
  </main>
</template>

<style scoped>
  header, main{
    color: #41A1E4;
    /* text-shadow: 1px 0 0 #41A1E4, 0 -1px 0 #41A1E4, 0 1px 0 #41A1E4, -1px 0 0 #41A1E4;  */
    -webkit-user-select:none;
    -moz-user-select:none;
    user-select:none;
  }
</style>
