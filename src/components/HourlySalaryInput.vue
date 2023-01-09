<template>
    <div class="salary-input-container">
        <SalaryInput title="Val. atlygis  į rankas" :shownValue="nettoVal" marker="amount-netto-hour" @input-change="change_amount"></SalaryInput>
        <SalaryInput title="Val. atlygis sutartije" :shownValue="bruttoVal"  marker="amount-brutto-hour" @input-change="change_amount"></SalaryInput>
        <SalaryInput title="Darbo val.kiekis" :shownValue="hours" marker="hours"  @input-change="change_hours_amount"></SalaryInput>
    </div>
</template>

<script>
import SalaryInput from './SalaryInput.vue';
    export default {

        name: "SalaryInputHolder",
        data() {
        return {
            hours:168,
            nettoVal:0,
            bruttoVal:0,
        }},
        props:["netto", "brutto", 'hour'],
         watch:{
            hour: function (newVal, oldVal){
                this.hours = newVal
            },
            netto: function(newVal, oldVal){
                    this.nettoVal = Math.round((newVal/this.hours)*1000)/1000          
            },
            brutto: function(newVal, oldVal){
                this.bruttoVal = Math.round((newVal/this.hours)*1000)/1000
            },

        },
        components: {SalaryInput},
        methods:{

            change_amount(i){
                const salary = i[0] * this.hours
                const markertext = i[1] == "amount-brutto-hour"? "amount-brutto":"amount-netto"
                this.$emit("input-amount", [salary,markertext])
            },
           
            change_hours_amount(i){
                this.hours = i[0]
                this.nettoVal = Math.round((this.netto/this.hours)*1000)/1000
                this.bruttoVal = Math.round((this.brutto/this.hours)*1000)/1000
                this.$emit('hour-change', i[0])
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