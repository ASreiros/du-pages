<template>
    <div class="info-container">
        <h3>Papildoma informacija</h3>
        <Info v-for="info in yearlyInfoBlock" :title="info[0]" :tax="info[1]"></Info>
        <p>Žemiau esanti informacija yra preliminari ir sudaryta su prielaida, kad skaičiojamas DU yra pastovus, dirbama 5 dienos per savaitė ir mėnesije yra 21 darbo diena</p>
        <div class="input-holder">
            <SalaryInput title="Ligos dienų kiekis" :shownValue="sickdays" marker="sickdays"  @input-change="change_sickdays"></SalaryInput>
        </div> 
        <Info v-for="info in sodraInfoBlock" :title="info[0]" :tax="info[1]"></Info>
        <p>Maksimalus kompensuojamas uždarbis vaiko priežiūros išmokoms apskaičiuoti negali viršyti dviejų šalies vidutinių mėnesinių darbo užmokesčių, galiojusių už praeitą ketvirtį iki teisės gauti vaiko priežiūros išmoką atsiradimo dienos, dydžio. Skaičiuoklė "lubų" netaiko, nes "lubos" yra kintamos ir kiekviename ketvirtije skirtingos</p>
        <p>{{comparisonText}}</p>

    </div>    
</template>

<script>
    import Info from './Info.vue';
    import SalaryInput from './SalaryInput.vue';
    export default {
        name: "Infoholder",
        components:{Info, SalaryInput},
        props:['netto', 'brutto', 'SodraFloor'],
        watch: { 
            netto: function(newVal, oldVal) { 
                this.yearlyInfoBlock.YearlySalaryNetto[1] = newVal*12
            },
            brutto: function(newVal, oldVal) { 
                this.yearlyInfoBlock.YearlySalaryBrutto[1] = newVal*12
                this.calculate_sickpay()
                this.calculate_childsupport()
                this.calculate_average_salary()
            },
            SodraFloor: function(newVal, oldVal) { 
                this.calculate_sickpay()
                this.calculate_childsupport()
            },

        },
    data() {
        return {
            sickdays:1,
            comparisonText :"",

            yearlyInfoBlock:{
                YearlySalaryBrutto:["Metinė alga iki mokesčių",0],
                YearlySalaryNetto:["Metinė alga į rankas",0], 
            },

            sodraInfoBlock:{
                WPPaymentBrutto:["Darbdavis moka už ligonlapio pirmos 2 ligos dienos, suma iki mokesčių atskaitos", 0],
                WPPaymentNetto:["Darbdavis moka už ligonlapį pirmos 2 ligos dienos, suma po mokesčių", 0],
                SodraPaymentBrutto:["Sodra moka už ligonlapį pradedant nuo 3 ligos dienos, suma iki mokesčių atskaitos", 0],
                SodraPaymentNetto:["Sodra moka už ligonlapį pradedant nuo 3 ligos dienos, suma po mokesčių", 0],

                ChildSingleYearBrutto:["Pasirinkus gauti išmoką iki vaikui sueis vieni metai, suma iki mokesčių per mėnesį", 0],
                ChildSingleYearNetto:["Pasirinkus gauti išmoką iki vaikui sueis vieni metai, suma iki mokesčių per mėnesį", 0],

                ChildOneYearBrutto:["Pasirinkus išmoką gauti iki vaikui sueis dveji metai, suma iki mokesčių už 1 metus per mėnesį", 0],
                ChildOneYearNetto:["Pasirinkus išmoką gauti iki vaikui sueis dveji metai, suma iki mokesčių už 1 metus per mėnesį", 0],

                ChildTwoYearBrutto:["Pasirinkus išmoką gauti iki vaikui sueis dveji metai, suma iki mokesčių už 2 metus per mėnesį", 0],
                ChildTwoYearNetto:["Pasirinkus išmoką gauti iki vaikui sueis dveji metai, suma iki mokesčių už 2 metus per mėnesį", 0],
            }


        }},

        methods:{
            change_sickdays(i){
                this.sickdays = i[0]
                this.calculate_sickpay()
            },
            calculate_sickpay(){
                const wpdays = this.sickdays > 2? 2:this.sickdays
                let sodraDays = this.sickdays - 2 
                sodraDays = sodraDays<0? 0:sodraDays
                let wpbrutto = Math.round(((840/21)*0.6206)*100)/100 
                if(this.brutto > 840 || !this.SodraFloor){
                    wpbrutto = Math.round(((this.brutto/21)*0.6206)*100)/100 
                } 
                
                this.sodraInfoBlock.WPPaymentBrutto[1] = wpbrutto*wpdays
                this.sodraInfoBlock.WPPaymentNetto[1] = (Math.round(wpbrutto*0.85*100)/100)*wpdays
                this.sodraInfoBlock.SodraPaymentBrutto[1]= wpbrutto*sodraDays
                this.sodraInfoBlock.SodraPaymentNetto[1]= Math.round(wpbrutto*sodraDays*0.79*100)/100  //-15gpm-6pds  

            },

            calculate_childsupport(){

                let bruttoMonth = 730
                if (this.brutto > 730 || !this.SodraFloor){
                    bruttoMonth = this.brutto
                }
                
                const singleYear = Math.round(bruttoMonth*0.7758*100)/100
                this.sodraInfoBlock.ChildSingleYearBrutto[1] = singleYear
                this.sodraInfoBlock.ChildSingleYearNetto[1] = Math.round(singleYear*0.79*100)/100

                const oneYear = Math.round(bruttoMonth*0.5431*100)/100
                this.sodraInfoBlock.ChildOneYearBrutto[1] = oneYear
                this.sodraInfoBlock.ChildOneYearNetto[1] = Math.round(oneYear*0.79*100)/100

                const twoYear = Math.round(bruttoMonth*0.3103*100)/100
                this.sodraInfoBlock.ChildTwoYearBrutto[1] = twoYear
                this.sodraInfoBlock.ChildTwoYearNetto[1] = Math.round(twoYear*0.79*100)/100
            },

            calculate_average_salary(){
                const average = 1768.40;
                let persent = 0; 
                let word = ""

                if(this.brutto){
                    if(average>this.brutto){
                        persent = Math.round(((average/this.brutto)-1)*1000)/10
                        word = "mažesnę"
                    }else{
                        persent = Math.round(((this.brutto/average)-1)*1000)/10
                        word = "didesnę"
                    }
                    this.comparisonText = `Jūsų alga ${word} nei 2022 m. pirmo pusmečio vidutinė alga ant ${persent}%`
                }else{
                    this.comparisonText = ""
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .info-container{
        width: 680px;
        box-shadow: 0 4px 8px 0 rgb(65, 161, 228, 0.2), 0 6px 20px 0 rgba(65, 161, 228, 0.19);
        height:fit-content;
        transition:height 0.5s ;
        padding: 10px;
        border: 1px solid rgb(65, 161, 228, 0.2);
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;


        h3{
        padding: 15px;
        text-align: center;
        font-size: 24px;
        color: darkblue;
        width: 100%;
        text-align: center;
        } 

        p{
            width: 90%;
            margin: 40px auto 0 auto;
            word-wrap: break-word;
            text-align: left;
        }

        .input-holder{
            width: 100%;
            display: flex;
            justify-content: center;
        }
    }
</style>