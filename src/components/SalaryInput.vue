<template>
    <div class="salary-input-holder">
        <label :for="marker">{{title}}</label>
        <input :id="marker"  type="text" :readonly="redonly" :style="{'background-color':redonly == 'true' ? 'lightgray': 'white'}" v-model="inputValue" v-on:input="inputChange" @focus="onfocus" >
    </div>
</template>

<script>
    export default {
        name: "SalaryInput",
        props : ['title', 'marker', 'redonly', "shownValue"],
        watch:{
            shownValue: function(newVal, oldVal){
                if(typeof(this.inputValue)=="string" && this.inputValue.substring(this.inputValue.length-1)=="."){
                    return
                }
                this.inputValue = newVal
            },
        },
        data() {
            return {
                inputValue:this.shownValue
            }
        },
        methods:{
            inputChange(){
                this.inputValue = this.inputValue.replace(",", ".")
                let inputValueValidated = 0
                if(!Number(this.inputValue)){
                    inputValueValidated = 0
                } else if(this.inputValue<0 ){
                    inputValueValidated = 0
                    this.inputValue = 0
                } else{
                    inputValueValidated = Math.round(this.inputValue*100)/100
                }

                this.$emit("input-change", [inputValueValidated, this.marker])
            },

            onfocus(){
                if(!this.inputValue){
                    this.inputValue = ""
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
    .salary-input-holder{
        display: flex;
        flex-direction: column;

        label{
            font-size: 20px;
            text-align: center;
            max-width: 200px;
        }

        input, input:focus{
            width: 200px;
            height: 40px;
            font-size: 20px;
            text-align: right;
            color: darkblue;
            // text-shadow: 1px 0 0 #41A1E4, 0 -1px 0 #41A1E4, 0 1px 0 #41A1E4, -1px 0 0 #41A1E4;
            padding: 10px;
            border-color:  #41A1E4;
        }

    }

</style>