<template>
    <div class="tax-div">
        <div class="left">{{title}}</div>
        <div class="right">
            <p>{{tax}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name:"Info",
        props:["title", "tax"],
    }
</script>

<style lang="scss" scoped>
.tax-div{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
    width: 100%;
    

    .left{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 70%;
    text-align: left;
    font-size: 18px;
    color: darkblue;
    }

    .right{
        width: 25%;
        text-align: center;
        font-size: 18px;
        color: darkblue;
    }
}

</style>