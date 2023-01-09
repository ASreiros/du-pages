<template>
 <div class="taxes">
        <div><h3>Darbuotojo mokesčiai</h3></div>
        <Info v-for="(taxvalue, index) in employeeTaxes" :title="index" :tax="taxvalue"></Info> 
        <div><h3>Darbdavio mokesčiai</h3></div>
        <Info v-for="(taxvalue, index) in employerTaxes" :title="index" :tax="taxvalue"></Info> 
    </div>
</template>

<script>
    import Info from './Info.vue';
    export default {
        name: 'Taxes',
        props : ['employeeTaxes','employerTaxes'],
        components:{Info},
    }
</script>

<style lang="scss" scoped>
    h3{
        padding: 15px;
        text-align: center;
        font-size: 24px;
        color: darkblue;
    }
</style>