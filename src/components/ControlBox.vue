<template>
  <div class="btn-box">
    <button v-show="calculations == 2" value="1" @click="makeChoice">
      Skaičiuoti DU be palyginimo
    </button>
    <button v-show="calculations == 1" value="2" @click="makeChoice">
      Palyginti du paskaičiavimus pagal darbo vietos kaina
    </button>
    <button @click="start_new">
      Ištrinti paskaičiavimus ir užkrauti pradinį lapą
    </button>
    <button v-show="calculations == 1 && !moreinfo" @click="more_info">
      Parodyti papildoma informacija
    </button>
    <button v-show="calculations == 1 && moreinfo" @click="more_info">
      Paslepti papildoma informacija
    </button>
  </div>
</template>

<script>
export default {
  name: "ControlBox",
  props: ["calculations"],
  watch: {
    calculations: function (newVal, oldVal) {
      if (newVal == 2) {
        this.moreinfo = false;
        this.$emit("moreinfo", this.moreinfo)
      } 
    },
  },
  data() {
        return {
          moreinfo:false,
        }
  },    
  methods: {
    makeChoice(e) {
      this.$emit("run_control", e.target.value);
    },
    start_new() {
      window.location.origin;
      window.location.href = window.location.origin;
    },

    more_info(){
      this.moreinfo = !this.moreinfo
      this.$emit("moreinfo", this.moreinfo)
    }
  },
};
</script>

<style lang="scss" scoped>
.btn-box {
  display: flex;
  flex-direction: row;
  width: 80vw;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin: 0px auto;

  button {
    width: 200px;
    height: 90px;
    font-size: 18px;
    border-radius: 4px;
    cursor: pointer;
    background-color: #41a1e4;
    border-color: #666666;
    color: white;
  }
}
</style>
