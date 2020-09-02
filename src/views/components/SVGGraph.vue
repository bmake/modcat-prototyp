<template>
  <div
    id="svgfield"
    :style="{
      border: '1px solid grey',
      'border-radius': '5px'
    }"
  ></div>
</template>

<script>
import axios from "axios";
import {selectQueries} from "../queries";

export default {
  name: "SvgGraph",
  props: ["moduleUri", "role", "newBoolean", "code", "studyProgram"],
  data() {
    return {
      svgfile: require("../../assets/modcat.svg"),
      gridSize: 100,
      moduleInfo: [],
      modBasicData: [],
      modOutcomes: [],
      modMethods: [],
      modLiterature: [],
      modTeachers: [],
      form: "BasicData"
    };
  },
  created() {},
  mounted() {
    d3.xml(this.svgfile).then(xml => {
      var importedNode = document.importNode(xml.documentElement, true);
      d3.select("div#svgfield")
        .classed("svg-container", true)
        .each(function() {
          this.appendChild(importedNode);
        });

      d3.select("svg#svg887").style("width", "100%");
      d3.select("svg#svg887").style("height", "100%");

      var svg = d3.select("svg#svg887");
      var g = svg.append("g");

      g.node().appendChild(svg.select("g").node());

      //this is where my problem happens
      d3.select("svg#svg887").call(
        d3.zoom().on("zoom", function() {
          g.attr("transform", d3.event.transform);
        })
      );

      this.styleImportedSVG();
    });
  },
  methods: {
    styleImportedSVG(d) {
      let _this = this;
      d3.select("#nodes")
        .selectAll("g")
        .on("mouseover", null)
        .on("mouseout", null)
        .on("click", null);
      d3.select("#nodes")
        .selectAll("g")
        .classed("selected", false);
      d3.select("#layer1")
        .selectAll("path")
        .style("stroke-width", 0.2);
      d3.select("defs")
        .selectAll("marker")
        .selectAll("path")
        .attr("transform", "scale(0.8) rotate(180) translate(12.5,0)");
      d3.select("#nodes")
        .selectAll("g:not(.faded)")
        .on("mouseover", function() {
          if (_this.role > 0) {
            this.style.cursor = "pointer";
            this.style.opacity = 0.5;
            this.style.transition = "0.3s opacity";
          } else {
            this.style.cursor = "default";
          }
        })
        .on("mouseout", function() {
          this.style.opacity = 1;
        })
        .on("click", function() {
          if (_this.role > 0) {
            _this.upG();
            //const g = d3.select('#nodes').selectAll("g")
            const g = d3.select("#nodes").selectAll("g");
            g.classed("selected", false);
            d3.select("#layer1")
              .selectAll("path")
              .style("stroke-width", 0.2);
            d3.select("defs")
              .selectAll("marker")
              .selectAll("path")
              .attr("transform", "scale(0.8) rotate(180) translate(12.5,0)");
            //d3.select(this).classed('selected', true)

            let id = this.id;
            let q = "";

            if (
              id == "nodeModulKuerzel" ||
              id == "nodeStudiengang" ||
              id == "nodeOrdnung" ||
              id == "nodePerson" ||
              id == "nodeModulkuerzel"
            ) {
              _this.form = "BasicData";
              d3.select("#nodeModulKuerzel").classed("selected", true);
              d3.select("#nodeStudiengang").classed("selected", true);
              d3.select("#nodeOrdnung").classed("selected", true);
              d3.select("#nodePerson").classed("selected", true);
              d3.select("#layer1")
                .selectAll("path.groupA")
                .transition()
                .duration(300)
                .style("stroke-width", "1px"); /*.style('stroke', 'red')*/
              d3.select("defs")
                .selectAll("marker")
                .selectAll("path.groupA")
                .attr(
                  "transform",
                  "scale(0.3) rotate(180) translate(12.5,0)"
                ); /*.style('stroke', 'red')*/
            } else if (id == "nodeSoWiSeXY") {
              //_this.form = "Teachers";
              d3.select("#nodeModulKuerzel").classed("selected", true);
              d3.select("#nodeSoWiSeXY").classed("selected", true);
              d3.select("#nodePerson").classed("selected", true);
              d3.select("#nodeOrganisation").classed("selected", true);
              d3.select("#nodes")
                .selectAll("g.groupS")
                .classed("faded", false);
              d3.select("#pathLabels")
                .selectAll("g.groupS")
                .classed("faded", false);
              d3.select("#layer1")
                .selectAll("path.groupD")
                .transition()
                .duration(300)
                .style("stroke-width", "1px");
              d3.select("defs")
                .selectAll("marker")
                .selectAll("path.groupD")
                .attr("transform", "scale(0.3) rotate(180) translate(12.5,0)");
              d3.select("#layer1")
                .selectAll("path.groupS")
                .classed("faded", false);
              d3.select("#layer1")
                .selectAll("path.groupS")
                .transition()
                .duration(300)
                .style("stroke-width", "1px");
              d3.select("defs")
                .selectAll("marker")
                .selectAll("path.groupS")
                .attr("transform", "scale(0.3) rotate(180) translate(12.5,0)");
            } else if (id == "nodeMethodik") {
              _this.form = "Methods";
              d3.select("#nodeModulKuerzel").classed("selected", true);
              d3.select("#nodeMethodik").classed("selected", true);
              d3.select("#layer1")
                .selectAll("path.groupC")
                .transition()
                .duration(300)
                .style("stroke-width", "1px");
              d3.select("defs")
                .selectAll("marker")
                .selectAll("path.groupC")
                .attr("transform", "scale(0.3) rotate(180) translate(12.5,0)");
              if (_this.modMethods.length == 0 && !_this.newBoolean) {
                let queryMethod = selectQueries.selectQueries("SVGqueryMethod", _this.moduleUri, _this.studyProgram)
                _this.queryModuleInfo(queryMethod);
              }
            } else if (id == "nodeDidaktik") {
              _this.form = "Outcomes";
              d3.select("#nodeModulKuerzel").classed("selected", true);
              d3.select("#nodeDidaktik").classed("selected", true);
              d3.select("#layer1")
                .selectAll("path.groupB")
                .transition()
                .duration(300)
                .style("stroke-width", "1px");
              d3.select("defs")
                .selectAll("marker")
                .selectAll("path.groupB")
                .attr("transform", "scale(0.3) rotate(180) translate(12.5,0)");
              if (_this.modOutcomes.length == 0 && !_this.newBoolean) {
                let queryOutcome = selectQueries.selectQueries("SVGqueryOutcome", _this.moduleUri, _this.studyProgram)
                _this.queryModuleInfo(queryOutcome);
              }
            } else if (id == "nodeLiteratur") {
              //_this.form = "Literature";
              d3.select("#nodeModulKuerzel").classed("selected", true);
              d3.select("#nodeLiteratur").classed("selected", true);
              d3.select("#nodePerson").classed("selected", true);
              d3.select("#nodeOrganisation").classed("selected", true);
              d3.select("#nodes")
                .selectAll("g.groupL")
                .classed("faded", false);
              d3.select("#pathLabels")
                .selectAll("g.groupL")
                .classed("faded", false);
              d3.select("#nodePerson").classed("faded", false);
              d3.select("#layer1")
                .selectAll("path.groupE")
                .transition()
                .duration(300)
                .style("stroke-width", "1px");
              d3.select("defs")
                .selectAll("marker")
                .selectAll("path.groupE")
                .attr("transform", "scale(0.3) rotate(180) translate(12.5,0)");
              d3.select("#layer1")
                .selectAll("path.groupL")
                .classed("faded", false);
              d3.select("#layer1")
                .selectAll("path.groupL")
                .transition()
                .duration(300)
                .style("stroke-width", "1px");
              d3.select("defs")
                .selectAll("marker")
                .selectAll("path.groupL")
                .attr("transform", "scale(0.3) rotate(180) translate(12.5,0)");
            }
          }
        });
    },
    queryModuleInfo(q) {
      axios
        .post(
          "http://fbw-sgmwi.th-brandenburg.de:3030/RelaunchJuly20_ModCat/query",
          q,
          {
            headers: { "Content-Type": "application/sparql-query" }
          }
        )
        .then(response => {
          // JSON responses are automatically parsed.
          this.moduleInfo = response.data.results.bindings;
        })
        .catch(e => {
          this.errors.push(e);
        });
    },
    updateGraphText() {
      let module = d3.select("#textModulkuerzel").select("tspan");
      let semester = d3.select("#textSoWiSeXY").select("tspan");
      let tModule;
      let tSemester;
      if (this.moduleInfo.length > 0) {
        tModule = "Modul " + this.moduleInfo[0].code.value;
        tSemester = this.moduleInfo[0].semester.value.substring(39);
      } else if (this.code != "") {
        tModule = "Modul " + this.code;
        tSemester = "So/WiSe XY";
      } else {
        tModule = "Modul <Kürzel>";
        tSemester = "So/WiSe XY";
      }
      module.text(tModule);
      semester.text(tSemester);

      let relaCenMod =
        d3
          .select("#rectModulkuerzel")
          .node()
          .getBBox().width /
          2 -
        5;
      d3.select("#textModulkuerzel")
        .attr("text-anchor", "middle")
        .attr("dx", relaCenMod);

      let relaCenSem =
        d3
          .select("#rectSoWiSeXY")
          .node()
          .getBBox().width /
          2 -
        8;
      d3.select("#textSoWiSeXY")
        .attr("text-anchor", "middle")
        .attr("dx", relaCenSem);
    },
    upG() {
      if (this.role > 0) {
        d3.select("#layer1")
          .selectAll(".faded")
          .classed("faded", false);
        let group = ".group" + this.role;
        d3.select("#layer1")
          .selectAll(group)
          .classed("faded", true);
        d3.select("#layer1")
          .selectAll(".groupS")
          .classed("faded", true);
        d3.select("#layer1")
          .selectAll(".groupL")
          .classed("faded", true);
      } else {
        d3.select("#layer1")
          .selectAll(".faded")
          .classed("faded", false);
      }
    }
  },
  watch: {
    moduleUri: {
      handler(uri) {
        d3.select("#nodes")
          .selectAll("g")
          .classed("selected", false);
        this.form = "BasicData";

        if (uri != null) {
          let queryBase = selectQueries.selectQueries("SVGqueryBase", uri, this.studyProgram)
          this.queryModuleInfo(queryBase);
        }
        this.modOutcomes = [];
        this.modMethods = [];
        this.modLiterature = [];
        this.modTeachers = [];
      }
    },
    moduleInfo: {
      handler(newData) {
        if (this.form == "BasicData") {
          this.updateGraphText();
          this.modBasicData = this.moduleInfo;
        } else {
          let mod = "mod" + this.form;
          this[mod] = this.moduleInfo;
        }
      }
    },
    modBasicData: {
      handler(newData) {
        if (this.modBasicData.length > 0) {
          let strArrLearn = newData[0].learnTypes.value.split(" | ");
          newData[0].learnTypes.value = strArrLearn;
          let strArrLan = newData[0].languages.value.split(" | ");
          newData[0].languages.value = strArrLan;
          this.$emit("modBasicData", newData);
        }
      }
    },
    modOutcomes: {
      handler(newData) {
        if (this.modOutcomes.length > 0) {
          let learnBlooms = newData[0].learnBlooms.value.split(" | ");
          for (let i = 0; i < learnBlooms.length; i++) {
            let itemArr = learnBlooms[i].split(" @ ");
            learnBlooms[i] = itemArr;
          }
          newData[0].learnBlooms.value = learnBlooms;
          let contents = newData[0].contents.value.split(" | ");
          newData[0].contents.value = contents;
          let exams = newData[0].exams.value.split(" | ");
          newData[0].exams.value = exams;
        }
        this.$emit("modOutcomes", newData);
      }
    },
    modMethods: {
      handler(newData) {
        if (this.modMethods.length > 0) {
          let interTypes = newData[0].interTypes.value.split(" | ");
          newData[0].interTypes.value = interTypes;
          let workloadDetails = newData[0].workloadDetails.value.split(" | ");
          for (let i = 0; i < workloadDetails.length; i++) {
            let itemArr = workloadDetails[i].split(" @ ");
            itemArr[1] = parseInt(itemArr[1]);
            workloadDetails[i] = itemArr;
          }
          newData[0].workloadDetails.value = workloadDetails;
        }
        this.$emit("modMethods", newData);
      }
    },
    modLiterature: {
      handler(v) {
        if (this.modLiterature.length > 0) {
          this.$emit("modLiterature", v);
        }
      }
    },
    modTeachers: {
      handler(v) {
        if (this.modTeachers.length > 0) {
          this.$emit("modTeachers", v);
        }
      }
    },
    form: {
      handler(v) {
        this.$emit("formType", v);
      }
    },
    role: {
      handler(v) {
        this.upG();
        this.styleImportedSVG();
      }
    }
  }
};
</script>

<style scoped>
.svg-container {
  display: inline-block;
  position: relative;
  width: 100%;
  vertical-align: top;
  overflow: hidden;
}
</style>
