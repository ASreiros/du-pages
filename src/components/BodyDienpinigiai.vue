<template>
    <div class="dienpinigiai-holder">
        <div class="holder">       
            <div class="select-holder">
                <label for="šalis">Pasirinkite šalį</label>
                <select name="šalis" id="šalis" v-model="daily" v-on:change="calculate_total">
                    <option v-for="country in dienpinigiaiData" :value="country[1]">{{country[0]}}</option>
                </select>
            </div>
            <div class="small-holder">
                <SalaryInput title="Dienų kiekis" :shownValue="days"  marker="numberofdays" @input-change="change_days"></SalaryInput>
                <SalaryInput title="Dienpinigių dydis" :shownValue="daily"  marker="daily" redonly="true" ></SalaryInput>
            </div>
            <SalaryInput title="Suma" :shownValue="total"  marker="suma" redonly="true" ></SalaryInput>
        </div>
    </div>
</template>

<script>
import SalaryInput from './SalaryInput.vue';
import dienpinigiaiData from '../common/dienpinigiaiData.js'

    export default {
    components: { SalaryInput },
    data() {
        return {
            dienpinigiaiData:[],
            days:1,
            daily:0,
            total:0
        }
    },

    mounted() {
            this.get_data();
        },
    
    methods:{
        get_data(){
            this.dienpinigiaiData = dienpinigiaiData()
            console.log(this.dienpinigiaiData);
        },

        change_days(i){
           this.days =Number(i[0]);
           this.calculate_total()
        },

        calculate_total(){
            console.log(this.daily);
            this.total = this.days * this.daily
        },

    },    
}
</script>

<style lang="scss" scoped>
    .dienpinigiai-holder{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        width: 680px;
        min-height: 15vh;
        margin: 20px auto;
        box-shadow: 0 4px 8px 0 rgb(65, 161, 228, 0.2), 0 6px 20px 0 rgba(65, 161, 228, 0.19);
        transition:height 0.5s ;
        padding: 20px;
        border: 1px solid rgb(65, 161, 228, 0.2);


        .holder{
            display: flex;
            flex-direction: column;
            gap: 10px;

            .select-holder{
                display: flex;
                flex-direction: column;

                label{
                    font-size: 22px;
                    text-align: center;
                    max-width: 200px;
                }

                select, select:focus{
                    height: 60px;
                    word-wrap: break-word;
                    font-size: 18px;
                    text-align: left;
                    color: darkblue;
                    padding: 10px;
                    border-color:  #41A1E4;
                }

                
            }

            .small-holder{
                display: flex;
                flex-direction: row;
                gap: 20px;
                align-items: center;
                justify-content: space-between;
            }


        }
    }
</style>