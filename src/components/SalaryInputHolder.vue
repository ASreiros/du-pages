<template>
    <div class="salary-input-container">
        <SalaryInput title="Suma į rankas" :shownValue="netto" marker="amount-netto" @input-change="change_amount"></SalaryInput>
        <SalaryInput title="Suma sutartyje" :shownValue="brutto"  marker="amount-brutto" @input-change="change_amount"></SalaryInput>
        <SalaryInput title="Darbo vietos kaina" :shownValue="total" marker="amount-total" redonly="true"></SalaryInput>
    </div>
</template>

<script>
import SalaryInput from './SalaryInput.vue';
    export default {

        name: "SalaryInputHolder",
        data() {
        return {
            nettoVal:0,
            bruttoVal:0,
            totalVal:0
        }},
        props:["netto", "brutto", "total"],
        watch:{
            netto: function(newVal, oldVal){
                this.nettoVal = newVal
            },
            netto: function(newVal, oldVal){
                this.bruttoVal = newVal
            },
            total: function(newVal, oldVal){
                this.totalVal = newVal
            },
        },
        components: {SalaryInput},
        methods:{
            change_amount(i){
                this.$emit("input-amount", i)
            },
        }
    }
</script>

<style lang="scss" scoped>
    .salary-input-container{
        padding: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

    }
</style>