export const selectQueries = {
  selectQueries: function(param, moduleUri, studyProgram) {
    let code = moduleUri.substring(39);

    if (param == "SVGqueryBase") {
      let SVGqueryBase =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>  " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/>  " +
        "PREFIX schema: <https://schema.org/>  " +
        "SELECT DISTINCT ?code ?label ?accPerson ?duration ?semester ?modType_name ?grade_name ?learnTypes ?eduUse ?swsSum ?ects ?studysem ?courseMode ?pre ?basedOnModuls ?eduLevel ?url ?comment ?languages" +
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
        " OPTIONAL { " +
        ' SELECT (GROUP_CONCAT(DISTINCT ?basedOnModul; separator=" | ") as ?basedOnModuls) ' +
        "    WHERE { " +
        "<" +
        moduleUri +
        ">  schema:isBasedOn ?basedOn . " +
        " ?basedOn schema:name ?basedOnModulLabel ;   " +
        "          schema:isPartOf ?studyprogram .   " +
        ' FILTER(lang(?basedOnModulLabel) = "de") ' +
        '  BIND(REPLACE(STR(?studyprogram), "https://bmake.th-brandenburg.de/module/BWIK", "FBW", "i") AS ?studyprogram1)  ' +
        '  BIND(REPLACE(STR(?studyprogram1), "https://bmake.th-brandenburg.de/module/MWIV", "FBW", "i") AS ?studyprogram2)  ' +
        '  BIND(REPLACE(STR(?studyprogram2), "https://bmake.th-brandenburg.de/module/BBWV", "FBW", "i") AS ?studyprogram3)  ' +
        '  BIND(REPLACE(STR(?studyprogram3), "https://bmake.th-brandenburg.de/module/MBWV", "FBW", "i") AS ?studyprogram4)  ' +
        '  BIND(REPLACE(STR(?studyprogram4), "https://bmake.th-brandenburg.de/module/BIFK", "FBI", "i") AS ?studyprogram5)  ' +
        '  BIND(REPLACE(STR(?studyprogram5), "https://bmake.th-brandenburg.de/module/BACS", "FBI", "i") AS ?studyprogram6)  ' +
        '  BIND(REPLACE(STR(?studyprogram6), "https://bmake.th-brandenburg.de/module/BMZK", "FBI", "i") AS ?studyprogramLabel)  ' +
        '  BIND(CONCAT(STR(?basedOn), " @ ", ?basedOnModulLabel, " @ ", ?studyprogramLabel) as ?basedOnModul) ' +
        "   } " +
        " } " +
        " OPTIONAL { <" +
        moduleUri +
        ">  schema:educationalLevel ?eduLevel . " +
        " } " +
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
        '   SELECT (GROUP_CONCAT(?comNames; separator=" | ") as ?learnBlooms)  ' +
        "   WHERE {  " +
        '   SELECT (CONCAT(?learnResult, " @ ", COALESCE(?comName1, "")) as ?comNames)  ' +
        "      WHERE {  " +
        'SELECT ?learnResult (GROUP_CONCAT(?addList; separator=" @ ") as ?comName1) ' +
        "    WHERE { " +
        "      SELECT ?learnResult ?position ?addList " +
        "      WHERE { " +
        "      module:LResults_" +
        code +
        "                 schema:itemListElement ?resList .  " +
        "                 ?resList schema:description ?learnResult ; " +
        "                         schema:position ?position .  " +
        "                  ?resList schema:additionalType ?addList . " +
        "      } GROUP BY ?learnResult ?position ?addList ORDER BY DESC(?addList)" +
        "    } GROUP BY ?learnResult ?position  ORDER BY ?position" +
        "   } " +
        "  } " +
        " } " +
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

    if (param == "PDF") {
      let generatePDF =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>  " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/>  " +
        "PREFIX schema: <https://schema.org/>  " +
        "SELECT DISTINCT ?code ?label ?learnTypes ?duration ?modType_name ?programName ?eduUse ?courseMode ?accPersonLabel ?instructorLabel ?languages ?pre ?basedOns ?ects ?workloadSum ?workloadDetails ?swsSum ?swsDetails ?exams ?grade_name ?learnResults ?contents ?interTypes ?citations ?comment ?url  " +
        " WHERE {  " +
        "<" +
        moduleUri +
        ">  schema:courseCode ?code ;  " +
        "         schema:name ?label ;  " +
        " schema:timeRequired ?duration ; " +
        "         schema:numberOfCredits ?ects ;  " +
        "         schema:hasCourseInstance ?semester ;  " +
        "         schema:accountablePerson ?accPerson ;  " +
        "         schema:coursePrerequisites ?pre . " +
        "            ?accPerson rdfs:label ?accPersonLabel . " +
        ' FILTER(lang(?label) = "de" && lang(?pre) = "de") ' +
        "            ?semester schema:courseMode ?courseMode ;  " +
        "                      schema:instructor ?instructor.  " +
        "            ?instructor rdfs:label ?instructorLabel .  " +
        "   module:" +
        studyProgram +
        " schema:name ?programName . " +
        '   FILTER(lang(?programName) = "de") ' +
        "  module:ModuleType_" +
        studyProgram +
        "_" +
        code +
        "  schema:value ?modType_name .  " +
        "  module:SWS_" +
        studyProgram +
        "_" +
        code +
        "  schema:value ?swsSum .  " +
        "   OPTIONAL { <" +
        moduleUri +
        ">  schema:educationalUse ?eduUse . " +
        '  FILTER(lang(?eduUse) = "de")  ' +
        "   }  " +
        "OPTIONAL { <" +
        moduleUri +
        ">  schema:url ?url . " +
        "   } " +
        "  OPTIONAL { <" +
        moduleUri +
        ">  schema:comment ?comment . " +
        "   } " +
        "  OPTIONAL { " +
        "    module:GradingRatio_" +
        studyProgram +
        "_" +
        code +
        " schema:value ?grade_name . " +
        "  }" +
        "            OPTIONAL {  " +
        '              SELECT (GROUP_CONCAT(?language; separator=", ") as ?languages)  ' +
        "              WHERE {  " +
        "              module:Language_" +
        studyProgram +
        "_" +
        code +
        "   schema:value ?lan .  " +
        '          BIND(REPLACE(?lan, "de", "Deutsch", "i") AS ?lan1)  ' +
        '          BIND(REPLACE(?lan1, "en", "Englisch", "i") AS ?language)  ' +
        "              }  " +
        "            }  " +
        "            OPTIONAL {  " +
        '           SELECT (GROUP_CONCAT(?learnType; separator=", ") as ?learnTypes)  ' +
        "              WHERE {  " +
        "                <" +
        moduleUri +
        "> schema:interactivityType ?learnType.  " +
        ' FILTER(lang(?learnType) = "de") ' +
        "              }  " +
        "            }  " +
        "            OPTIONAL {  " +
        '       SELECT (SUM(?workloadValue) as ?workloadSum) (GROUP_CONCAT(?workloadDetail; separator="\\n") as ?workloadDetails)  ' +
        "                WHERE {  module:CompWL_" +
        code +
        " schema:valueReference ?workload .  " +
        "                  ?workload schema:name ?workloadName ;  " +
        "                            schema:value ?workloadValue .  " +
        '                  BIND(CONCAT(?workloadName, ": ", STR(?workloadValue), " Stunden") as ?workloadDetail)  ' +
        "                }  " +
        "            }  " +
        "            OPTIONAL {  " +
        '       SELECT (GROUP_CONCAT(?exam; separator="\\n") as ?exams)  ' +
        "                WHERE {  " +
        "                module:Exam_" +
        code +
        "  schema:itemListElement ?examCode.  " +
        "                  ?examCode schema:name ?exam .  " +
        "                }  " +
        "            }  " +
        "            OPTIONAL {  " +
        '       SELECT (GROUP_CONCAT(?learnResult; separator="\\n") as ?learnResults)  ' +
        "                WHERE {  " +
        "                module:LResults_" +
        code +
        " schema:itemListElement ?resList .  " +
        "                  ?resList schema:description ?learnResult  " +
        "                }  " +
        "            }  " +
        "    OPTIONAL {  " +
        '       SELECT (GROUP_CONCAT(?content; separator="\\n") as ?contents)  ' +
        "                WHERE {  " +
        "                  SELECT ?content  " +
        "                  WHERE {  " +
        "                module:Content_" +
        code +
        "   schema:itemListElement ?contentCode .  " +
        " ?contentCode schema:name ?content . " +
        "                  } ORDER BY ?contentCode  " +
        "                }  " +
        "            }  " +
        "            OPTIONAL {  " +
        '       SELECT (GROUP_CONCAT(?interType; separator="\\n") as ?interTypes)  ' +
        "                WHERE {  " +
        "                module:TeachingForms_" +
        code +
        "  schema:itemListElement ?interTypeCode .  " +
        "  ?interTypeCode schema:name ?interType " +
        "                }  " +
        "            }  " +
        "            OPTIONAL {  " +
        '       SELECT (GROUP_CONCAT(?citation; separator="\\n") as ?citations)  ' +
        "                WHERE {  " +
        '                  SELECT (CONCAT((GROUP_CONCAT(?authorLabel; separator=", ")), "\\n", ?headline) as ?citation)  ' +
        "                  WHERE {  " +
        "                    <" +
        moduleUri +
        "> schema:citation ?citationCode .  " +
        "                    ?citationCode schema:author ?author ;  " +
        "                                  schema:headline ?headline .  " +
        "                    ?author rdfs:label ?authorLabel .  " +
        "                  } GROUP BY ?headline  " +
        "                }  " +
        "            }  " +
        " }";
      return generatePDF;
    }
  }
};
