<template>      
<div id="example" class="main-holder">
    <div id="calculator" class="calculator" :class="{ 'two-calculators':calculations>1, 'one-calculator':calculations<=1 }">
        <div class="setting-container">
            <h4 v-show="calculations>1">{{result == -1 ? "Darbo vietos kainos lygios": result === number? "Brangesnis darbdaviui variantas":"Pigesnis darbdaviui variantas" }}</h4>
            <HourlySalaryInput v-show="hourlyRate" @input-amount="set_amount" @hour-change="change_hours" :brutto="brutto" :netto="netto" :hour="hour" ></HourlySalaryInput>
            <SalaryInputHolder @input-amount="set_amount" :brutto="brutto" :netto="netto" :total="TotalPrice"></SalaryInputHolder>
            <Settings v-bind="$props" :hourlyRate="hourlyRate" @change_hourly="change_hourly" @settingChange="change_setting"   />
            <button class="print-pdf" v-show="salary>0" v-on:click="exportPdf">download PDF</button>
        </div>
        <div class="result-container">
            <Taxes :employeeTaxes="employeeTaxes" :employerTaxes="employerTaxes" />
        </div>
        <Infoholder v-show="calculations == 1 && moreinfo" :SodraFloor="SodraFloor" :netto="netto" :brutto="brutto" :citizen="citizen"></Infoholder>
    </div>
</div>
</template>

<script>
import SalaryInputHolder from './SalaryInputHolder.vue'
import Settings from './Settings.vue';
import Taxes from './Taxes.vue';

import * as pdfFonts from "pdfmake/build/vfs_fonts.js"; // <-- vfs_fonts has to be imported before pdfmake
import pdfMake from 'pdfmake';
import HourlySalaryInput from './HourlySalaryInput.vue';
import Infoholder from './Infoholder.vue';
;
pdfMake.vfs = pdfFonts.pdfMake.vfs;

    export default {
    name: "SingleCalculation",
    data() {
        return {
            bruttoSalary:true,
            salary:0,
            NPD:true,
            addSodraTax:0,
            citizen:true,
            hourlyRate:false,
            hour:168,

            employeeTaxes:{
                'GPM':0, 
                'PSD':0,
                'VSD':0, 
                'Papildoma įmoka pensijos kaupimui':0,
            },
            employerTaxes:{
                "Garantinis fondas":0,
                "Ilgalaikio darbo išmokų fondas":0,
                "Nelaimingų atsitikimų darbe draudimas":0,
                "Nedarbo socialinis draudimas":0,
                "Mokesčio suma dėl Sodros grindų":0,
                "Viso":0
            },

            agreementTerm:false,
            SodraFloor:true,
            SodraGroup:0.0014,
            SodraGroupText:"I",
            SodraGroupValue:0,
            employmentLvl:0,
            employmentLvlText:"Pilnai darbingas",
            employerType:"I",

            GPM:0,
            PSD:0,
            VSD:0,
            addTax:0,

            Garant:0,
            agreementTermTax:0,
            SodraFloorValue:0,
            incident:0,
            longterm:0,
            wTotal:0,

            netto:0,
            brutto:0,
            TotalPrice:0,
        }
    },
    props : ['number', 'calculations', 'result', 'moreinfo'],
    components: { Settings, Taxes, SalaryInputHolder, HourlySalaryInput, Infoholder },
    mounted() {
            this.check_link();
        },
    methods:{
        check_link(){
            const queryString = window.location.search;
            if(!queryString){
            return
            }
            let decodedString = "";
            try{
            decodedString = atob(queryString.substring(1));
            }catch {
            window.location.origin
            window.alert("Nuoroda neteisinga, bus užkrautas pradinis vaizdas")
            window.location.href = window.location.origin;
            }
            const urlParams = new URLSearchParams("?" + decodedString);
            if(urlParams.get(`salary${this.number}`) && urlParams.get(`npd${this.number}`) &&urlParams.get(`citizen${this.number}`) && urlParams.get(`bruttoSalary${this.number}`) && urlParams.get(`agreementTerm${this.number}`) && urlParams.get(`addSodraTax${this.number}`) && urlParams.get(`SodraFloor${this.number}`)&& urlParams.get(`SodraGroupValue${this.number}`) && urlParams.get(`employmentLvl${this.number}`) && urlParams.get(`hourlyRate${this.number}`) && urlParams.get(`hour${this.number}`)){
                this.salary = Number(urlParams.get(`salary${this.number}`))
                this.NPD = urlParams.get(`npd${this.number}`)  == "true"? true : false
                this.citizen = urlParams.get(`citizen${this.number}`) == "true"? true : false
                this.hour = Number(urlParams.get(`hour${this.number}`))
                this.bruttoSalary = urlParams.get(`bruttoSalary${this.number}`) == "true"? true : false
                this.agreementTerm = urlParams.get(`agreementTerm${this.number}`) == "true"? true : false
                this.addSodraTax = Number(urlParams.get(`addSodraTax${this.number}`))
                this.SodraFloor = urlParams.get(`SodraFloor${this.number}`) == "true"? true : false
                this.changeSodraGroup(Number(urlParams.get(`SodraGroupValue${this.number}`)))
                this.changeEmploymentLvl(Number(urlParams.get(`employmentLvl${this.number}`)))
                this.hourlyRate = urlParams.get(`hourlyRate${this.number}`) == "true"? true : false
            } else{
                window.location.origin
                window.alert("Nuoroda neteisinga, bus užkrautas pradinis vaizdas")
                console.log("Single calculation");
                window.location.href = window.location.origin;
            }
        },

        exportPdf(){
            const bodycontent = [
                                ["Suma sutartyje", this.brutto],
                                ["Suma į rankas", this.netto],
                                ["Darbo vietos kaina", this.TotalPrice]]
            if(this.hourlyRate){
                bodycontent.push(["Val. įkainis sutartyje", Math.round((this.brutto/this.hour)*1000)/1000])
                bodycontent.push(["Val. įkainis į rankas", Math.round((this.netto/this.hour)*1000)/1000])
                bodycontent.push(["Valandų kiekis",this.hour])
            } 
            let docDefinition = {
                pageMargins: [ 40, 60, 40, 60 ],
              
                content: [
                    { text: "Atlyginimo skaičioklė", style: 'mainHeader' },
                    " ",
                    { text: "Resultatai", style: 'header' },
                    " ",
                    {
                        table: {
                            widths: [ '*', '*' ],

                            body: bodycontent
                        },

                    },
                    " ",
                    { text: "Darbuotojo mokesčiai", style: 'header' },
                    " ",
                    {
                        table: {
                            widths: [ '*', '*' ],

                            body: [
                                ["GPM", this.GPM],
                                ["PSD", this.PSD],
                                ["VSD", this.VSD],
                                ["Papildoma įmoka pensijos kaupimui", this.addTax],

                            ]
                        },

                    },
                    " ",
                    { text: "Darbdavio mokesčiai", style: 'header' },
                    " ",
                    {
                        table: {
                            widths: [ '*', '*' ],

                            body: [
                                ["Garantinis fondas", this.Garant],
                                ["Ilgalaikio darbo išmokų fondas", this.longterm],
                                ["Nelaimingų atsitikimų darbe draudimas", this.incident],
                                ["Nedarbo socialinis draudimas", this.agreementTermTax],
                                ["Mokesčio suma dėl Sodros 'grindų'", this.SodraFloorValue],
                                ["Viso", this.wTotal],
                            ]
                        },

                    },
                    " ",
                    { text: "Pritaikyti nustatymai", style: 'header' },
                    " ",
                    {
                        table: {
                            widths: [ '*', '*' ],

                            body: [
                                ["Ar skaičiuoti NPD?", this.NPD? "Taip" : "Ne" ],
                                ["Papildoma pensijos įmoka", this.addSodraTax],
                                ["Darbingumas", this.employmentLvlText],
                                ["Ar yra Lietuvos pilietis", this.citizen? "Taip" : "Ne"],
                                ["Terminuota sutartis", this.agreementTerm ? "Taip" : "Ne"],
                                ["Sodros grindys taikomos?", this.SodraFloor? "Taip" : "Ne"],
                                ["Nelaimingų atsitikimų darbe grupė", this.SodraGroupText],
                            ]
                        },

                    },


                ],

                styles: {
                    mainHeader: {
                    fontSize: 22,
                    bold: true,
                    alignment:'center',
                    },
                    header:{
                      fontSize:18,
                      alignment:"center",  
                    },
                    defaultStyle: {
                        fontSize: 18,
                        bold: true
                    }
                }
            };

            const pdf = pdfMake.createPdf(docDefinition)
            pdf.download("Atlyginimo skaičioklė.pdf")
        },

        change_setting(data){
            const key = data[1];
            const value = data[0];

            switch (key) {
                case "0%":
                    this.addSodraChange(value)   
                    break;
                case "NPD taikyti":
                    this.NPDchange(value)   
                    break;
                case 'Sodros grindys taikomos':
                    this.changeSodraFloor(value)    
                    break;    
                case 'Pilnai darbingas':
                    this.changeEmploymentLvl(value)   
                    break;  
                case 'Lietuvos pilietis':
                    this.checkCitizenship(value)    
                    break; 
                case 'Neterminuota sutartis':
                    this.changeAgreementTerm(value)   
                    break; 
                case 'I grupė':
                    this.changeSodraGroup(value)    
                    break;    
                default:
                    console.log("Something went wrong with Settings in change_setting");
                    break;
            }
        },



        NPDchange(i){
            this.NPD = i==0? true:false;
            this.calculateDU();
        },

        addSodraChange(i){
            switch (i) {
                case 0:
                    this.addSodraTax = 0;    
                    break;
                case 1:
                    this.addSodraTax = 3;    
                    break;
                case 2:
                    this.addSodraTax = 3;    
                    break;        
            }
            this.calculateDU();
        },

        checkCitizenship(i){
                this.citizen = i==0? true:false;
                this.calculateDU();

            },
        
        changeAgreementTerm(i){
            this.agreementTerm = i==0? false:true
            this.calculateDU();
     
        },    

        changeSodraFloor(i){
            this.SodraFloor = i==0? true:false;
            this.calculateDU();

        },    

        changeSodraGroup(i){
            this.SodraGroupText = i;
            this.SodraGroupValue = i;
            switch (i) {
                case 0:
                    this.SodraGroup = 0.0014
                    this.SodraGroupText = "I"  
                break;
                case 1:
                    this.SodraGroup = 0.0047
                    this.SodraGroupText = "II"   
                break
                case 2:
                    this.SodraGroup = 0.007
                    this.SodraGroupText = "III"    
                break
                case 3:
                this.SodraGroup = 0.014
                this.SodraGroupText = "IV"  
                break    
            
                default:
                    console.log("Error:something wrong with employerType");
                    break;
            }
            this.calculateDU();
            
        },    

        changeEmploymentLvl(i){
            this.employmentLvl = i
            switch (i) {
                case 0:
                this.employmentLvlText = "Pilnai darbingas" 
                break;
                case 1:
                this.employmentLvlText = "Gaunu senatvės pensija" 
                break;
                case 2:
                this.employmentLvlText = "30-55 procentų darbingumo lygis"   
                break;
                case 3:
                this.employmentLvlText = "0-25 procentų darbingumo lygis"  
                break;        
            
                default:
                break;
            }
            this.calculateDU();
            
        }, 

        changeEmployerType(i){
            this.employerType = i
            this.calculateDU();
        },  


        change_hourly(){
            this.hourlyRate = !this.hourlyRate;
        },

        change_hours(i){
            this.hour = i
        },

        set_amount(i){
            this.bruttoSalary = i[1] == "amount-brutto"?true:false;

            this.salary = i[0]
            this.calculateDU()
        },
    
        
        calculateDU(){
            let brutto = this.salary;
            let netto = this.salary;
            if(this.bruttoSalary){
                //Suma nurodyta sutartije
                netto = this.findNetto(brutto)
            } else{
                let flag = false
                brutto  = Math.round(netto * 1.6529*100)/100
                let counter = 0
                while (!flag && counter <50) {
                    const tryNetto = this.findNetto(brutto)
                    if(tryNetto !== netto){
                        brutto = brutto - tryNetto + netto
                        counter++  
                    } else{
                        flag = true
                    }
                }
            }

            let tbrutto = brutto
            if(tbrutto < 840 && tbrutto >0){
                tbrutto = 840;
            }
            const TermTax = this.agreementTerm? 0.0203 : 0.0131
            this.agreementTermTax = Math.round(tbrutto*TermTax*100)/100
            this.Garant = Math.round(tbrutto*0.0016*100)/100
            this.longterm = Math.round(tbrutto*0.0016*100)/100
            this.incident = Math.round(tbrutto*this.SodraGroup*100)/100    //
            if (brutto < 840 && this.SodraFloor &&brutto > 0) {
                    const base = this.citizen ? 163.80 : 105.17; // 840 min alga
                    this.SodraFloorValue =  Math.round((base-this.VSD - this.PSD)*100)/100 
            } else{
                this.SodraFloorValue = 0;
            }
            this.wTotal = Math.round((this.agreementTermTax+this.Garant + this.longterm + this.incident + this.SodraFloorValue)*100)/100
            this.netto = Math.round(netto*100)/100;
            this.brutto = Math.round(brutto*100)/100;
            this.TotalPrice = Math.round((brutto + this.wTotal)*100)/100;

            this.employeeTaxes={
                'GPM':this.GPM, 
                'PSD':this.PSD,
                'VSD':this.VSD, 
                'Papildoma įmoka pensijos kaupimui':this.addTax,
            }

            this.employerTaxes={
                "Garantinis fondas":this.Garant,
                "Ilgalaikio darbo išmokų fondas":this.longterm,
                "Nelaimingų atsitikimų darbe draudimas":this.incident,
                "Nedarbo socialinis draudimas":this.agreementTermTax,
                "Mokesčio suma dėl Sodros grindų":this.SodraFloorValue,
                "Viso":this.wTotal
            },


            this.$emit("du-results",           
                {
                index:Number(this.number),
                brutto:this.brutto,
                netto:this.netto,
                total:this.TotalPrice,
            })

            this.$emit("du-settings",
            {
                index:Number(this.number),
                salary:this.salary,
                npd:this.NPD,
                employmentLvl:this.employmentLvl,
                citizen:this.citizen,
                addSodraTax:this.addSodraTax,
                agreementTerm:this.agreementTerm,
                SodraFloor:this.SodraFloor,
                SodraGroupValue:this.SodraGroupValue,
                bruttoSalary:this.bruttoSalary,
                hourlyRate:this.hourlyRate,
                hour:this.hour
            }
            )  
        },

        findNetto(brutto){
            let netto = 0
            let npd = 0
            if(this.NPD){
                switch (this.employmentLvl) {
                    case 1:
                        npd = 1005;
                    break;
                    case 2:
                        npd = 935;
                    break;
                    case 3:
                        npd = 1005;
                    break;
                    case 0:
                        if(brutto<=840){
                            npd = 625
                        } else if (brutto <= 1704){
                            npd = 625 - 0.42*(brutto - 840)
                        } else{
                            npd = 400-0.18*(brutto - 642)
                        }
                            
                    break;    
                    default:
                        console.log("employment lvl error", this.employmentLvl);
                    break;
                }
                if(npd < 0){
                    npd = 0
                }
                npd = (Math.round(npd*100)/100)
            }
                
            this.GPM = Math.round((brutto - npd)*0.2*100)/100
            this.GPM = this.GPM > 0 ? this.GPM : 0;
            this.VSD = Math.round((brutto*0.1252)*100)/100
            this.VSD = this.VSD > 11298.8 ? 11298.8 : this.VSD
            this.PSD = this.citizen ? Math.round((brutto*0.0698)*100)/100 : 0;
            this.addTax = Math.round((brutto*this.addSodraTax/100)*100)/100

            netto =Math.round((brutto - this.GPM - this.VSD - this.PSD-this.addTax)*100)/100
            
            return netto
        },

    },
}
</script>

<style lang="scss" scoped>


.main-holder{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: wrap;
    color: darkblue;
}

h4{
    text-align: center;
    color: darkblue;
    font-size: 22px; 
    text-decoration: underline;
}

.one-calculator{
    margin: auto;
    width: 90vw;
    max-width: 1500px;
    flex-direction: row;
    justify-content: space-between;
}

.two-calculators{
    width: 680px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.calculator{
    background-color: white;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 50px;

    .setting-container{
        width: 680px;
        box-shadow: 0 4px 8px 0 rgb(65, 161, 228, 0.2), 0 6px 20px 0 rgba(65, 161, 228, 0.19);
        height:fit-content;
        transition:height 0.5s ;
        padding: 10px;
        border: 1px solid rgb(65, 161, 228, 0.2);
        margin-bottom: 20px;
    }

    .result-container{
        width: 500px;
        box-shadow: 0 4px 8px 0 rgb(65, 161, 228, 0.2), 0 6px 20px 0 rgba(65, 161, 228, 0.19);
        height:fit-content;
        transition:height 0.5s ;
        padding: 10px;
        border: 1px solid rgb(65, 161, 228, 0.2);
        margin-bottom: 20px;
    }

    .print-pdf{
        padding: 10px;
        font-size: 16px;
        background-color: #41A1E4;
        color: white;
        cursor: pointer;
        width: 100%;
        text-transform: uppercase;
        border: 1px solid #3691d3;
    }
    
}








.example{
    display: none;
}





.noshow{
    display: none !important;
}

</style>