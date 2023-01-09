<template>
  <ControlBox
    :calculations="calculations"
    @run_control="run_control"
    @moreinfo="more_info"
  ></ControlBox>
  <div class="link-holder">
    <button class="btn-small btn-save" v-on:click="save_calculations">
      Išsaugoti paskaičiavimus naršyklėje
    </button>
    <button class="btn-small btn-link" v-on:click="set_link">
      Gauti nuoroda
    </button>
    <button class="btn-small btn-load" v-on:click="load_calculations">
      Užkrauti išsaugotus paskaičiavimus
    </button>
  </div>
  <div class="holder">
    <div v-for="(calculation, index) in calculations">
      <SingleCalculation
        @du-results="du_results"
        @du-settings="du_settings"
        :calculations="calculations"
        :result="result"
        :number="index"
        :moreinfo="moreinfo"
      ></SingleCalculation>
    </div>
  </div>
</template>

<script>
import ControlBox from "./ControlBox.vue";
import SingleCalculation from "./SingleCalculation.vue";

export default {
  name: "CalculatorBody",
  components: {
    SingleCalculation,
    ControlBox,
  },
  data() {
    return {
      calculations: 1,
      result: -1,
      moreinfo:false,

      calculationResults: [
        {
          index: 0,
          brutto: 0,
          netto: 0,
          total: 0,
        },
        {
          index: 1,
          brutto: 0,
          netto: 0,
          total: 0,
        },
      ],
      calculationSettings: [
        {
          index: 0,
          salary: 0,
          npd: true,
          employmentLvl: 0,
          citizen: true,
          bruttoSalary: true,
          agreementTerm: false,
          addSodraTax: 0,
          SodraFloor: true,
          SodraGroupValue: 0,
        },
        {
          index: 1,
          salary: 0,
          npd: true,
          employmentLvl: 0,
          citizen: true,
          bruttoSalary: true,
          agreementTerm: false,
          addSodraTax: 0,
          SodraFloor: true,
          SodraGroupValue: 0,
        },
      ],
    };
  },

  components: { ControlBox, SingleCalculation },

  mounted() {
    this.check_link();
  },

  methods: {
    check_link() {
      const queryString = window.location.search;
      if (!queryString) {
        return;
      }
      let decodedString = "";
      try {
        decodedString = atob(queryString.substring(1));
      } catch {
        window.location.origin;
        window.alert("Nuoroda neteisinga, bus užkrautas pradinis vaizdas");
        window.location.href = window.location.origin;
      }
      const urlParams = new URLSearchParams("?" + decodedString);
      if (urlParams.get("calculations")) {
        this.calculations = Number(urlParams.get("calculations"));
      } else {
        window.location.origin;
        window.alert("Nuoroda neteisinga, bus užkrautas pradinis vaizdas");
        console.log("Calculator body");
        window.location.href = window.location.origin;
      }
    },

    prepare_link() {
      const location = window.location.origin;
      let url = new URLSearchParams();
      url.set("calculations", this.calculations);

      for (let z = 0; z < this.calculationSettings.length; z++) {
        Object.keys(this.calculationSettings[z]).forEach((key) => {
          url.set(`${key}${z}`, this.calculationSettings[z][key]);
        });
      }
      const encodedUrl = btoa(url.toString());
      let link = location + "?" + encodedUrl;

      return link;
    },

    set_link() {
      const link = this.prepare_link();
      navigator.clipboard.writeText(link).then(
        function () {
          window.alert(
            "nuoroda nukopijuota į iškarpinę, galite ją įklijuoti į naršyklė arba el. laišką"
          );
        },
        function (err) {
          window.alert("Nukopijuoti neišejo: ", err);
        }
      );
    },

    save_calculations() {
      const link = this.prepare_link();
      localStorage.setItem("ducalculation", link);
      window.alert("Skaičiavimai išsaugoti naršyklėjė");
    },

    load_calculations() {
      const link = localStorage.getItem("ducalculation");
      if (link) {
        window.location.href = link;
      } else {
        window.alert(
          "Užkrauti neišejo, nes nėra išsauguotų paskaičiavimų. Bus užkrautas pradinis lapas"
        );
        window.location.origin;
        window.location.href = window.location.origin;
      }
    },

    run_control(i) {
      switch (i) {
        case "1":
          this.calculations = 1;
          break;
        case "2":
          this.calculations = 2;
          break;
        default:
          console.log("something wrong in run_control");
          break;
      }
      this.sort_results();
    },
    du_results(i) {
      for (let x = 0; x < this.calculationResults.length; x++) {
        if (this.calculationResults[x].index == i.index) {
          this.calculationResults[x].netto = i.netto;
          this.calculationResults[x].brutto = i.brutto;
          this.calculationResults[x].total = i.total;
        }
      }
      this.sort_results();
    },

    more_info(i){
      this.moreinfo = i
    },

    sort_results() {
      if (this.calculationResults[0].total === this.calculationResults[1].total) {
        this.result = -1;
      } else if (this.calculationResults[0].total > this.calculationResults[1].total) {
        this.result = 0;
      } else {
        this.result = 1;
      }
    },

    du_settings(i) {
      for (let x = 0; x < this.calculationSettings.length; x++) {
        if (this.calculationSettings[x].index == i.index) {
          this.calculationSettings[x] = i;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.comparison-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 80vw;
  margin: 0 auto;
  border: 3px double dark #41a1e4;
  .comparison-box-name {
    width: 100%;
    font-size: 20px;
    border: 1px solid black;
    text-align: center;
    padding: 15px;
  }
  .comparison-box-title {
    display: flex;
    flex-direction: row;
    font-size: 0;
    width: 100%;
    div {
      text-align: center;
      width: calc(50% - 127px);
      font-size: 16px;
      border: 1px solid black;
    }

    div:nth-child(1) {
      width: 254px;
    }
  }

  .comparison-holder {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    border: black 1px solid;

    .comparison-holder-name {
      p {
        border: black 1px dashed;
        width: 254px;
        font-size: 20px;
        line-height: 26px;
        margin: 0;
        text-align: left;
        padding: 0 20px;
      }
    }

    .comparison-holder-results {
      width: calc(100% - 254px);
      display: flex;
      flex-direction: row;

      .comparison-container {
        width: 100%;
      }
    }
  }
}
.holder {
  margin: 75px 0 0 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10vw;
}
.link-holder {
  margin: 20px 0 0 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;

  .btn-small {
    position: relative;
    padding: 10px 20px;
    width: 140px;
    min-height: 40px;
    text-transform: uppercase;
    background-color: #41a1e4;
    border: 1px solid darkgray;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    margin: 0;
  }
  .btn-link:hover::after,
  .btn-save:hover::after,
  .btn-load:hover::after {
    content: "Nuoroda kopijojama į buferį, lieka tik ją iklijuoti į pageidaujama vieta (pvz. naršyklę, el. paštą)";
    font-size: 12px;
    background-color: white;
    color: black;
    top: 70px;
    left: 0;
    position: absolute;
    z-index: 2;
    text-transform: none;
  }

  .btn-save:hover::after {
    content: "Skaičiavimai išsaugomi naršyklėjė. Išsaugojus naujus skaičiavimus, seni ištrinami";
  }

  .btn-load:hover::after {
    content: "Užkraunami išsauguoti skaičiavimai. Jei išsauguotu skaičiavimu nėra-užkraunamas pradinis lapas";
  }
}
</style>
