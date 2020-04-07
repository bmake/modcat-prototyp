<template>
  <div
    id="svgfield"
    :style="{
      width: width + 'px',
      height: height + 'px',
      border: '1px solid grey',
      'border-radius': '5px'
    }"
  ></div>
</template>

<script>
import axios from "axios";

export default {
  name: "SvgGraph",
  props: ["moduleUri", "role"],
  data() {
    return {
      svgfile: require("../../assets/modcat.svg"),
      width: 1024,
      height: 600,
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
  created() {
    this.width = window.innerWidth / 2.5;
    this.height = window.outerHeight / 1.5;
  },
  mounted() {
    d3.xml(this.svgfile).then(xml => {
      var importedNode = document.importNode(xml.documentElement, true);
      d3.select("div#svgfield")
        .classed("svg-container", true)
        .each(function() {
          this.appendChild(importedNode);
        });

      let w = d3.select("svg#svg887").style("width");
      w = parseInt(w.substring(0, w.length - 2));
      let h = d3.select("svg#svg887").style("height");
      h = parseInt(h.substring(0, h.length - 2));
      if (this.width < w) {
        d3.select("svg#svg887").style("width", this.width + "px");
      }
      if (this.height < h) {
        d3.select("svg#svg887").style("height", this.height + "px");
      }

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
          this.style.opacity = 0.5;
          this.style.transition = "0.3s opacity";
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
            console.log("id", id);
            let q = "";

            if (
              /*id == "nodeModulKuerzel" || */ id == "nodeStudiengang" ||
              id == "nodeOrdnung" ||
              id == "nodePerson"
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
            } else if (id == "nodeDidaktik") {
              _this.form = "Methods";
              d3.select("#nodeModulKuerzel").classed("selected", true);
              d3.select("#nodeDidaktik").classed("selected", true);
              d3.select("#layer1")
                .selectAll("path.groupC")
                .transition()
                .duration(300)
                .style("stroke-width", "1px");
              d3.select("defs")
                .selectAll("marker")
                .selectAll("path.groupC")
                .attr("transform", "scale(0.3) rotate(180) translate(12.5,0)");
              if (_this.modMethods.length == 0) {
                q =
                  "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
                  "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
                  "PREFIX schema: <https://schema.org/> " +
                  "SELECT DISTINCT ?code ?interTypes ?workloadSum ?workloadDetails " +
                  "WHERE { " +
                  "  <" +
                  _this.moduleUri +
                  "> schema:courseCode ?code . " +
                  "  OPTIONAL { " +
                  ' SELECT (GROUP_CONCAT(?interType; separator=" | ") as ?interTypes) ' +
                  "    WHERE { " +
                  "      <" +
                  _this.moduleUri +
                  "> schema:interactivityType ?interType . " +
                  "    } " +
                  "} " +
                  "  OPTIONAL { " +
                  'SELECT (SUM(?workloadValue) as ?workloadSum) (GROUP_CONCAT(?workloadDetail; separator=" | ") as ?workloadDetails) ' +
                  "WHERE { " +
                  "  SELECT DISTINCT * " +
                  "  WHERE { " +
                  "      <" +
                  _this.moduleUri +
                  "> module:addProp_CompWL ?addPropCompWL . " +
                  "      ?addPropCompWL schema:valueReference ?workload . " +
                  "      ?workload schema:name ?workloadName ; " +
                  "                schema:value ?workloadValue . " +
                  '      BIND(CONCAT(?workloadName, " @ ", STR(?workloadValue)) as ?workloadDetail) ' +
                  "    } ORDER BY ?workload " +
                  "}" +
                  "  } " +
                  "}";
                _this.queryModuleInfo(q);
              }
            } else if (id == "nodeBeschreibung") {
              _this.form = "Outcomes";
              d3.select("#nodeModulKuerzel").classed("selected", true);
              d3.select("#nodeBeschreibung").classed("selected", true);
              d3.select("#layer1")
                .selectAll("path.groupB")
                .transition()
                .duration(300)
                .style("stroke-width", "1px");
              d3.select("defs")
                .selectAll("marker")
                .selectAll("path.groupB")
                .attr("transform", "scale(0.3) rotate(180) translate(12.5,0)");
              if (_this.modOutcomes.length == 0) {
                q =
                  "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
                  "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
                  "PREFIX schema: <https://schema.org/> " +
                  "SELECT DISTINCT ?code ?learnBlooms ?contents ?exams " +
                  "WHERE { " +
                  "  <" +
                  _this.moduleUri +
                  "> schema:courseCode ?code . " +
                  "  OPTIONAL { " +
                  '   SELECT (GROUP_CONCAT(?learnBloom; separator=" | ") as ?learnBlooms)  ' +
                  "   WHERE {  " +
                  '   SELECT (CONCAT(?learnResult, " @ ", COALESCE(?bloom_name, "")) as ?learnBloom)  ' +
                  "      WHERE {  " +
                  "        <" +
                  _this.moduleUri +
                  "> module:about_LResults ?LResult.  " +
                  "        ?LResult schema:itemListElement ?resList .  " +
                  "        ?resList schema:description ?learnResult ;  " +
                  "                 schema:position ?position .  " +
                  "        OPTIONAL {  " +
                  "          ?resList schema:additionalType ?addList .  " +
                  '          FILTER regex(str(?addList), "BloomTax", "i")  ' +
                  "          ?addList schema:name ?bloom_name .  " +
                  '          FILTER (LANG(?bloom_name) = "en") .  ' +
                  "        }  " +
                  "      } ORDER BY ?position  " +
                  "    }" +
                  "    } " +
                  "  OPTIONAL { " +
                  '    SELECT (GROUP_CONCAT(?exam; separator=" | ") as ?exams) ' +
                  "    WHERE { " +
                  "      <" +
                  _this.moduleUri +
                  "> module:about_Exam ?examCode. " +
                  "      ?examCode schema:itemListElement ?exam . " +
                  "    } " +
                  "  } " +
                  "  OPTIONAL { " +
                  '    SELECT (GROUP_CONCAT(?content; separator=" | ") as ?contents) ' +
                  "    WHERE { " +
                  "      SELECT ?content " +
                  "      WHERE { " +
                  "        <" +
                  _this.moduleUri +
                  "> module:about_Content ?contentCode. " +
                  "        ?contentCode schema:itemListElement ?content . " +
                  "      } ORDER BY ?content " +
                  "    } " +
                  "  } " +
                  "   " +
                  "} ";
                _this.queryModuleInfo(q);
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
      let query =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX schema: <https://schema.org/> " +
        "SELECT DISTINCT * " +
        "WHERE { " +
        "<" +
        this.moduleUri +
        "> rdfs:label ?label; " +
        "          schema:courseCode ?code; " +
        "          schema:hasCourseInstance ?instance; " +
        "          schema:accountablePerson ?person. " +
        "}";

      axios
        .post("http://fbw-sgmwi.th-brandenburg.de:3030/modcat/query", q, {
          headers: { "Content-Type": "application/sparql-query" }
        })
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
        let queryBase =
          "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>  " +
          "PREFIX module: <https://bmake.th-brandenburg.de/module/>  " +
          "PREFIX schema: <https://schema.org/>  " +
          "SELECT DISTINCT ?code ?label ?semester ?modType_name ?grade_name ?learnTypes ?eduUse ?swsSum ?ects ?duration ?courseMode ?pre ?url ?comment ?languages" +
          " WHERE {  " +
          "<" +
          uri +
          ">  schema:courseCode ?code ;  " +
          "         rdfs:label ?label;  " +
          "         module:eduAlignm_Curr ?curr ;   " +
          "         module:eduAlignm_Grade ?grade ;  " +
          "         module:eduAlignm_ModuleType ?modType ;   " +
          "         schema:educationalCredentialAwarded ?ects ;  " +
          "         schema:hasCourseInstance ?semester ;  " +
          "         schema:educationalUse ?eduUse ;  " +
          "         module:eduAlignm_SWS ?sws ; " +
          "         schema:accountablePerson ?accPerson ;  " +
          "         schema:coursePrerequisites ?pre ;  " +
          "         schema:url ?url ;  " +
          "         schema:comment ?comment .  " +
          "            ?accPerson rdfs:label ?accPersonLabel . " +
          "            ?semester schema:duration ?durationSem;  " +
          "                      schema:courseMode ?courseMode ;  " +
          "                      schema:instructor ?instrctor.  " +
          '            BIND(REPLACE(?durationSem, "P0.5Y", "1 Semester", "i") AS ?durationSem1) ' +
          '            BIND(REPLACE(?durationSem1, "P1Y", "2 Semester", "i") AS ?duration)' +
          "            ?instrctor rdfs:label ?instructorLabel .  " +
          "            ?curr schema:targetName ?curr_name ;  " +
          "                  schema:targetDescription ?curr_des .  " +
          "            ?grade schema:targetName ?grade_name ;  " +
          "                   schema:targetDescription ?grade_des .  " +
          "            ?modType schema:targetName ?modType_name ." +
          "            ?sws schema:targetName ?swsSum . " +
          "            OPTIONAL {  " +
          '           SELECT (GROUP_CONCAT(?learnType; separator=" | ") as ?learnTypes)  ' +
          "              WHERE {  " +
          "                <" +
          uri +
          "> schema:learningResourceType ?learnType.  " +
          "              }  " +
          "            }  " +
          "OPTIONAL { " +
          '    SELECT (GROUP_CONCAT(?lan; separator=" | ") as ?languages) ' +
          "    WHERE { " +
          "    <" +
          uri +
          "> schema:inLanguage ?lan . " +
          "  } " +
          "  }" +
          " }";
        this.queryModuleInfo(queryBase);
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
        console.log("modMethods", newData);
        this.$emit("modMethods", newData);
      }
    },
    modLiterature: {
      handler(v) {
        console.log("modLiterature", v);
        if (this.modLiterature.length > 0) {
          this.$emit("modLiterature", v);
        }
      }
    },
    modTeachers: {
      handler(v) {
        console.log("modTeachers", v);
        if (this.modTeachers.length > 0) {
          this.$emit("modTeachers", v);
        }
      }
    },
    form: {
      handler(v) {
        console.log("form", v);
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
