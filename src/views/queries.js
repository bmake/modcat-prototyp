export const selectQueries = {
  selectQueries: function(param, moduleUri, studyProgram) {
    let code = moduleUri.substring(39);

    if (param == "SVGqueryBase") {
      let SVGqueryBase =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>  " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/>  " +
        "PREFIX schema: <https://schema.org/>  " +
        "SELECT DISTINCT ?code ?label ?accPerson ?duration ?semester ?modType_name ?grade_name ?learnTypes ?eduUse ?basedOn ?swsSum ?ects ?studysem ?courseMode ?pre ?url ?comment ?languages" +
        " WHERE {  " +
        "<" +
        moduleUri +
        ">  schema:courseCode ?code ;  " +
        "         schema:name ?label ;  " +
        "         schema:numberOfCredits ?ects ;  " +
        "         schema:timeRequired ?duration ;  " +
        "         schema:hasCourseInstance ?semester ;  " +
        "         schema:accountablePerson ?accPerson ; " +
        "         schema:coursePrerequisites ?pre .  " +
        ' FILTER(lang(?label) = "de" && lang(?pre) = "de") ' +
        "   module:ModuleType_" +
        studyProgram +
        "_" +
        code +
        " schema:value ?modType_name . " +
        "   module:SWS_" +
        studyProgram +
        "_" +
        code +
        " schema:value ?swsSum . " +
        "   ?semester schema:courseMode ?courseMode .  " +
        " OPTIONAL { " +
        '  SELECT (GROUP_CONCAT(?learnType; separator=" | ") as ?learnTypes) ' +
        "  WHERE { <" +
        moduleUri +
        "> schema:interactivityType ?learnType . " +
        ' FILTER(lang(?learnType) = "de") ' +
        "  } " +
        "} " +
        " OPTIONAL { " +
        '  SELECT (GROUP_CONCAT(?lan; separator=" | ") as ?languages) ' +
        "    WHERE { " +
        "      module:Language_" +
        studyProgram +
        "_" +
        code +
        "      schema:value ?lan . " +
        "    }" +
        "  } " +
        " OPTIONAL { <" +
        moduleUri +
        ">  schema:educationalUse ?eduUse . " +
        ' FILTER(lang(?eduUse) = "de") ' +
        " } " +
        //" OPTIONAL { <" +
        //moduleUri +
        //">  schema:isBasedOn ?basedOn . " +
        //" } " +
        " OPTIONAL { <" +
        moduleUri +
        ">  schema:url ?url . " +
        " } " +
        " OPTIONAL { <" +
        moduleUri +
        ">  schema:comment ?comment . " +
        " } " +
        " OPTIONAL { " +
        " module:GradingRatio_" +
        studyProgram +
        "_" +
        code +
        " schema:value ?grade_name . " +
        "  } " +
        " OPTIONAL { " +
        " module:StudySem_" +
        studyProgram +
        "_" +
        code +
        " schema:value ?studysem . " +
        "  } " +
        " } ";
      return SVGqueryBase;
    }

    if (param == "SVGqueryOutcome") {
      let SVGqueryOutcome =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/> " +
        "SELECT DISTINCT ?code ?label ?learnBlooms ?contents ?exams " +
        "WHERE { " +
        "  <" +
        moduleUri +
        "> schema:courseCode ?code ; " +
        "         schema:name ?label .  " +
        'FILTER(lang(?label) = "de")' +
        "  OPTIONAL { " +
        '   SELECT (GROUP_CONCAT(?learnBloom; separator=" | ") as ?learnBlooms)  ' +
        "   WHERE {  " +
        '   SELECT (CONCAT(?learnResult, " @ ", COALESCE(?bloom_name, "")) as ?learnBloom)  ' +
        "      WHERE {  " +
        " module:LResults_" +
        code +
        "         schema:itemListElement ?resList .  " +
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
        '    SELECT (GROUP_CONCAT(?examName; separator=" | ") as ?exams) ' +
        "    WHERE { " +
        " module:Exam_" +
        code +
        "      schema:itemListElement ?exam . " +
        " ?exam schema:name ?examName ; " +
        "       schema:position ?examPos . " +
        "    } ORDER BY ?examPos " +
        "  } " +
        "  OPTIONAL { " +
        '    SELECT (GROUP_CONCAT(?contentName; separator=" | ") as ?contents) ' +
        "    WHERE { " +
        " module:Content_" +
        code +
        "      schema:itemListElement ?content . " +
        " ?content schema:name ?contentName ; " +
        "       schema:position ?contentPos . " +
        "    } ORDER BY ?contentPos " +
        "  } " +
        " } ";
      return SVGqueryOutcome;
    }

    if (param == "SVGqueryMethod") {
      let SVGqueryMethod =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/> " +
        "SELECT DISTINCT ?code ?label ?interTypes ?workloadSum ?workloadDetails " +
        "WHERE { " +
        "  <" +
        moduleUri +
        "> schema:courseCode ?code ; " +
        "         schema:name ?label .  " +
        'FILTER(lang(?label) = "de")' +
        "  OPTIONAL { " +
        '    SELECT (GROUP_CONCAT(?teachingFormName; separator=" | ") as ?interTypes) ' +
        "    WHERE { " +
        " module:TeachingForms_" +
        code +
        "      schema:itemListElement ?teachingForm . " +
        " ?teachingForm schema:name ?teachingFormName ; " +
        "       schema:position ?teachingFormPos . " +
        "    } ORDER BY ?teachingFormPos " +
        "  } " +
        "  OPTIONAL { " +
        'SELECT (SUM(?workloadValue) as ?workloadSum) (GROUP_CONCAT(?workloadDetail; separator=" | ") as ?workloadDetails) ' +
        "WHERE { " +
        "  SELECT DISTINCT * " +
        "  WHERE { " +
        " module:CompWL_" +
        code +
        "      schema:valueReference ?workload . " +
        "      ?workload schema:name ?workloadName ; " +
        "                schema:value ?workloadValue . " +
        '      BIND(CONCAT(?workloadName, " @ ", STR(?workloadValue)) as ?workloadDetail) ' +
        "    } ORDER BY ?workload " +
        "}" +
        "  } " +
        "}";
      return SVGqueryMethod;
    }
  }
};
