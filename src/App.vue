<template>
  <div class="navline">
      <div class="navblock">
        <router-link to="/">Atlyginimo skaičiuoklė</router-link>
        <router-link to="/dienpinigiai">Dienpinigiai</router-link>
    </div>
  </div>
  <router-view />
</template>

<script>
export default {
  name: 'App',
}
</script>

<style lang="scss">
.navline{
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-end;

  .navblock{
    color: #41A1E4;
    margin: 5px 20px;
    display: flex;
    flex-direction: row;
    gap: 20px;
  }
}
</style>
