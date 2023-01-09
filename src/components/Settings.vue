<template>
        <div id="calculatorInfo" class="calculator-input">

            <div class="container">
                <Setting :info="addTaxData" :checked="addTaxchecked" title="Papildoma pensijos įmoka" @change = setting_change ></Setting>
            </div>
            <div class="container">
                <Setting :info="NPDdata" :checked="NPDchecked" title="" @change = setting_change ></Setting>
                <Setting :info="SodraFloorData" :checked="SodraFloorChecked" title="" @change = setting_change ></Setting>
            </div>
            <div class="container">
                <div class="setting-btn-container">
                <div class="div-btn" v-on:click="change_view">
                    <div class="btn" :class="{activebtn:settings}"></div>
                        <p :class="{active: !settings}">Paslepti nustatymus</p>
                        <p :class="{active: settings}">Parodyti nustatymus</p>
                    </div>
                </div>
                <div class="setting-btn-container">
                <div class="div-btn" v-on:click="change_hourly">
                    <div class="btn" :class="{activebtn:hourRate}"></div>
                        <p :class="{active: !hourRate}">Slepti val. skaičiavimus</p>
                        <p :class="{active: hourRate}">Rodyti val. skaičiavimus</p>
                    </div>
                </div>
            </div>
            <div class="container" v-show="settings">
                <Setting :info="employmentLvlData" :checked="employmentLvlChecked" title="" @change = setting_change ></Setting>
            </div>

            <div class="container" v-show="settings">
                <Setting :info="citizenData" :checked="citizenChecked" title="" @change = setting_change ></Setting>
                <Setting :info="agreementTermData" :checked="agreementTermChecked" title="" @change = setting_change ></Setting>
            </div>

            <div class="container" v-show="settings" >
                <Setting :info="SodraGroupData" :checked="SodraGroupChecked" title="" @change = setting_change ></Setting>
            </div>
        </div>
</template>

<script>
    import Setting from './Setting.vue';
    export default {
        name:"Settings",
        props : ['number', 'calculations', 'hourlyRate'],
        watch: {
            hourlyRate: function (newVal, oldVal) {
                this.hourRate = newVal
            },
        },
        data(){
        return{
            NPDdata:["NPD taikyti","NPD netaikyti"],
            NPDchecked:0,

            addTaxData:["0%", "3%"],
            addTaxchecked:0,

            employmentLvlData:["Pilnai darbingas", "Gaunu senatvės pensija", "30-55 procentų darbingumo lygis", "0-25 procentų darbingumo lygis"],
            employmentLvlChecked:0,

            citizenData:["Lietuvos pilietis", "Kitos šalies pilietis"],
            citizenChecked:0,

            agreementTermData:["Neterminuota sutartis", "Terminuota sutartis"],
            agreementTermChecked:0,

            SodraFloorData:["Sodros grindys taikomos", "Sodros grindys netaikomos"],
            SodraFloorChecked:0,

            SodraGroupData:["I grupė", "II grupė", "III grupė", "IV grupė"],
            SodraGroupChecked:0,

            settings:false,
            hourRate:this.hourlyRate,
            salary:0,
        }
        },
        components:{
            Setting
        },
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
                console.log("Setting first block");
                window.location.href = window.location.origin;
                }
                decodedString = "?" + decodedString;
                const urlParams = new URLSearchParams(decodedString);
                if(urlParams.get(`npd${this.number}`) &&urlParams.get(`citizen${this.number}`) && urlParams.get(`bruttoSalary${this.number}`) && urlParams.get(`agreementTerm${this.number}`) && urlParams.get(`addSodraTax${this.number}`) && urlParams.get(`SodraFloor${this.number}`)&& urlParams.get(`SodraGroupValue${this.number}`) && urlParams.get(`employmentLvl${this.number}`)){
                    this.settings = true;
                    this.NPDchecked = urlParams.get(`npd${this.number}`) == "true"? 0:1;     
                    this.employmentLvlChecked = Number(urlParams.get(`employmentLvl${this.number}`));
                    this.citizenChecked = urlParams.get(`citizen${this.number}`) == "true"? 0:1;
                    this.agreementTermChecked =  urlParams.get(`agreementTerm${this.number}`)== "true"? 1:0;
                    this.SodraFloorChecked = urlParams.get(`SodraFloor${this.number}`) == "true"? 0:1;
                    this.SodraGroupChecked =urlParams.get(`SodraGroupValue${this.number}`);
                    this.addTaxchecked = urlParams.get(`addSodraTax${this.number}`) == 0? 0:1;
                }  else{
                window.location.origin
                window.alert("Nuoroda neteisinga, bus užkrautas pradinis vaizdas")
                window.location.href = window.location.origin;

                } 
            },

            setting_change(i){
                this.$emit("settingChange", i)
            },

            change_view(){
                if(this.settings){
                    this.settings = false
                } else{
                    this.settings = true
                }
            },

            change_hourly(){
                this.$emit("change_hourly")
            }
        },     
    }

</script>

<style lang="scss" scoped>
.container{
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    
    h3{
        text-align: center;
        width: 100%;
    }

    .left{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 45%;
    }

    .right{
        width: 45%;
        text-align: center;
    }

    .right>input{
        width: 90%;
        height: 90%;
        text-align: right;
    }

    .right>select{
        width: 90%;
        height: 50px;
        text-align: right;
        padding: 5px;
    }

    .right>select>option{
        padding: 5px;
    }
    
}
.setting-btn-container{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    width: 50%;
    padding: 10px;
    
        .div-btn{
            width: 250px;
            height: 50px;
            border: #41A1E4 1px solid;
            display: flex;
            flex-direction: row;
            cursor: pointer;

            p{
                position: relative;
                z-index: 3;
                font-size: 12px;
                text-align: center;
                color: darkblue;
                text-shadow: none;
                width: 50%;
                height: 100%;
                line-height: 20px;
                padding: 5px 10px;
                // text-shadow: 1px 0 0 #41A1E4, 0 -1px 0 #41A1E4, 0 1px 0 #41A1E4, -1px 0 0 #41A1E4; 

            }

            .active{
                font-size: 14px;
                color: white;
            }

            .btn{
                position: absolute;
                z-index: 2;
                width: 50%;
                background-color: #41A1E4;
                border: #3691d3 2px solid;
                height: 100%;
                top: 0;
                left:0;
                transition:left 0.5s ;
            }

            .activebtn{
                left: 50%
            }
        }
}

</style>