<template>
    <div class="setting-box" :class="{long: info.length > 2}">
        <div  v-show=title >
            <p class="title">{{title}}</p>
        </div>  
        <div v-for="(line, index) in info" :data-value="index" class="choice" :class="{active: activeValue == index }" v-on:click="choice_made">
            <p :data-value="index">{{line}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name:"Setting",
        data(){
            return{  
                activeValue:0             
            }
        },
        props:['info', 'checked', 'title'],
        watch:{
            checked: function(newVal, oldVal){
                this.activeValue = newVal
            }
        },

        methods:{
            choice_made(e){
                this.activeValue = Number(e.target.getAttribute("data-value"))
                this.$emit("change", [this.activeValue, this.info[0]])
            }
        },
        
    }
</script>

<style lang="scss" scoped>
   .setting-box{
        width: 50%;
        display: flex;
        flex-direction: row;
        min-height: 40px;
        justify-content:space-between;
        margin:0 10px;
        border: 1px dotted #41A1E4;
        padding: 5px;
        

        div{
            min-height: 40px;
            min-width: 60px;
            width: 140px;
            height: 55px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2px;
        }

        .choice{
            max-width: 150px;
            text-align: center;
            border: double 3px #41A1E4;
            transition:background-color 0.5s ;
            cursor: pointer;
        }

        .active{
            background-color: #41A1E4;
            color: white;
        }
   }

   .long{
    width: 100%;
   }
</style>