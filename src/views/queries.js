export const selectQueries = {
  selectQueries: function(param, moduleUri, studyProgram) {
    let code = moduleUri.substring(39);

    // für Rahmendaten
    if (param == "SVGqueryBase") {
      let SVGqueryBase =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>  " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/>  " +
        "PREFIX schema: <https://schema.org/>  " +
        "SELECT DISTINCT ?code ?label ?accPerson ?accPersonLabel ?duration ?semester ?modType_name ?grade_name ?learnTypes ?eduUse ?swsSum ?ects ?studysem ?courseMode ?pre ?basedOnModuls ?url ?comment ?languages" +
        " WHERE {  " +
        "<" +
        moduleUri +
        // Modulkürzel
        ">  schema:courseCode ?code ;  " +
        // Modulbezeichung
        "         schema:name ?label ;  " +
        // ECTS
        "         schema:numberOfCredits ?ects ;  " +
        // Dauer: z.B. 1 Semester...
        "         schema:timeRequired ?duration ;  " +
        // Kurs Instanz (URI)
        "         schema:hasCourseInstance ?semester ;  " +
        // Modulverantwortliche (URI)
        "         schema:accountablePerson ?accPerson . " +
        // Modulverantwortliche Label (Prof. Dr....)
        "   ?accPerson rdfs:label ?accPersonLabel .  " +
        // Deutsche Modulbezeichnungen,
        ' FILTER(lang(?label) = "de") ' +
        // Modultyp (Wahlpflicht, Pflicht)
        "   module:ModuleType_" +
        studyProgram +
        "_" +
        code +
        " schema:value ?modType_name . " +
        // SWS
        "   module:SWS_" +
        studyProgram +
        "_" +
        code +
        " schema:value ?swsSum . " +
        // Häufigkeit (jedes Wintersemester, jedes Sommersemester ...)
        "   ?semester schema:courseMode ?courseMode .  " +
        // Alle Vorraussetzungen in einem String zu fügen, getrennt durch '/'
        " OPTIONAL { " +
        '  SELECT (GROUP_CONCAT(?cpre; separator="/") as ?pre) ' +
        "  WHERE { <" +
        moduleUri +
        "> schema:coursePrerequisites ?cpre . " +
        ' FILTER(lang(?cpre) != "en") ' +
        "  } " +
        "} " +
        // Alle Lehrformen in einem String zu fügen, getrennt durch ' | '
        " OPTIONAL { " +
        '  SELECT (GROUP_CONCAT(?learnType; separator=" | ") as ?learnTypes) ' +
        "  WHERE { <" +
        moduleUri +
        "> schema:interactivityType ?learnType . " +
        ' FILTER(lang(?learnType) = "de") ' +
        "  } " +
        "} " +
        // Alle Sprachen in einem String zu fügen, getrennt durch ' | '
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
        //Verwendbarkeit auf Deutsch abzufragen
        " OPTIONAL { <" +
        moduleUri +
        ">  schema:educationalUse ?eduUse . " +
        ' FILTER(lang(?eduUse) = "de") ' +
        " } " +
        // Alle Module (URI) bei "basiert auf", getrennt durch ' | '
        " OPTIONAL { " +
        ' SELECT (GROUP_CONCAT(DISTINCT ?basedOnModul; separator=" | ") as ?basedOnModuls) ' +
        "    WHERE { " +
        "<" +
        moduleUri +
        ">  schema:isBasedOn ?basedOn . " +
        // Abhängigkeit zwischen Modulen und Fachbereichen abzufragen
        " ?basedOn schema:name ?basedOnModulLabel ;   " +
        "          schema:isPartOf ?studyprogram .   " +
        "  ?studyprogram  schema:provider  ?department  " +
        ' FILTER(lang(?basedOnModulLabel) = "de") ' +
        "  BIND(SUBSTR(STR(?department), 44) AS ?studyprogramLabel)   " +
        '  BIND(CONCAT(STR(?basedOn), " @ ", ?basedOnModulLabel, " @ ", ?studyprogramLabel) as ?basedOnModul) ' +
        "   } " +
        " } " +
        /*" OPTIONAL { <" +
        moduleUri +
        ">  schema:educationalLevel ?eduLevel . " +
        " } " +*/
        //URL des Moduls
        " OPTIONAL { <" +
        moduleUri +
        ">  schema:url ?url . " +
        " } " +
        //Kommentar für Modul
        " OPTIONAL { <" +
        moduleUri +
        ">  schema:comment ?comment . " +
        " } " +
        // Notengewichtung
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

    // Für Didaktik
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
        // Lernergebnisse, Kompetenzen, Bloomsche Taxonomie
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
        // Prüfungsleistungen
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
        // Inhaltselemente
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

    // für Methodik
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
        // Lehr- und Lernmethode
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
        // Gesamtworkload, Workload-Komponente in Stunden
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

    // für Methodik auf Moduldetailseite Browsing (ModuleMethod.vue)
    if (param == "MMqueryMethod") {
      let MMqueryMethod =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/> " +
        "SELECT DISTINCT ?code ?label ?interTypes ?workloadSum ?workloadDetails " +
        "WHERE { " +
        "  module:" +
        code +
        " schema:courseCode ?code ; " +
        "         schema:name ?label .  " +
        'FILTER(lang(?label) = "de")' +
        // Lehr- und Lernmethode
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
        // Gesamtworkload, Workload-Komponente in Stunden
        'SELECT (SUM(?workloadValue) as ?workloadSum) (GROUP_CONCAT(?workloadDetail; separator=" | ") as ?workloadDetails) ' +
        "WHERE { " +
        "  SELECT DISTINCT * " +
        "  WHERE { " +
        " module:CompWL_" +
        code +
        "      schema:valueReference ?workload . " +
        "      ?workload schema:name ?workloadName ; " +
        "                schema:value ?workloadValue . " +
        '      BIND(CONCAT(?workloadName, ": ", STR(?workloadValue), " Stunden") as ?workloadDetail) ' +
        "    } ORDER BY ?workload " +
        "}" +
        "  } " +
        "}";
      return MMqueryMethod;
    }

    // für Literatur auf Moduldetailseite Browsing (ModuleLiterature.vue)
    if (param == "MLqueryLiterature") {
      let MLqueryLiterature =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/> " +
        "PREFIX dc: <http://purl.org/dc/elements/1.1/> " +
        'SELECT ?code ?label ?literaturUri ?titel ?auflage (GROUP_CONCAT(?autorFullname; separator=", ") as ?authors)' +
        " ?datePublished ?isbn ?litIdentifier ?pageStart ?pageEnd ?publisher " +
        "WHERE {" +
        "module:" +
        code +
        " schema:courseCode ?code ;" +
        "                schema:name ?label ." +
        '  FILTER(lang(?label) = "de")' +
        "  OPTIONAL {" +
        //"module:GPMO " + //Nur zum Test
        "module:" +
        code +
        " schema:citation ?literaturUri." +
        "    ?literaturUri schema:headline ?titel." +
        "    OPTIONAL {" +
        "      ?literaturUri schema:datePublished ?datePublished." +
        "    }" +
        "    OPTIONAL {" +
        //Autoren
        "   ?literaturUri schema:itemListElement ?autorList . " +
        "   ?autorList schema:identifier ?autorUri . " +
        "        OPTIONAL {" +
        "          ?autorUri  schema:givenName ?autorVorname." +
        "        }" +
        "        OPTIONAL {" +
        "            ?autorUri  schema:familyName ?autorNachname." +
        "        }" +
        '        BIND((CONCAT(STR( ?autorVorname ), " ", STR( ?autorNachname)) ) AS ?autorFullname ) .' +
        "    }" +
        "    OPTIONAL {" +
        "      ?literaturUri a schema:Book." +
        "      OPTIONAL {" +
        "        ?literaturUri schema:bookEdition ?auflage." +
        "      }" +
        "      OPTIONAL {" +
        "        ?literaturUri schema:isbn ?isbn." +
        "      }" +
        "    }" +
        "    OPTIONAL {" +
        "      ?literaturUri schema:identifier ?litIdentifier." +
        "    }" +
        "    OPTIONAL {" +
        "      ?literaturUri a schema:Article." +
        "      OPTIONAL {" +
        "        ?literaturUri schema:pageStart ?pageStart;" +
        "                      schema:pageEnd ?pageEnd." +
        "      }" +
        "    }" +
        "    OPTIONAL {" +
        "      ?literaturUri dc:publisher ?publisher." +
        "    }" +
        "  }" +
        "} group by ?code ?label ?literaturUri ?titel ?auflage ?datePublished ?isbn ?litIdentifier ?pageStart ?pageEnd ?publisher";
      return MLqueryLiterature;
    }

    //SPARQL-Abfrage für Literatur
    if (param == "SVGqueryLiteratur") {
      let SVGqueryLiteratur =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/> " +
        "SELECT ?code ?label ?literaturUri ?titel ?auflage ?autorUri ?autorLabel ?autorVorname ?autorNachname " +
        "?autorProfilLink ?datePublished ?isbn ?litIdentifier ?pageStart ?pageEnd ?publisherUri ?publisherName " +
        "WHERE { " +
        //"module:GPMO " + //Nur zum Test
        "  <" +
        moduleUri +
        "> " +
        "schema:courseCode ?code ; " +
        "         schema:name ?label .  " +
        'FILTER(lang(?label) = "de") ' +
        "OPTIONAL { " +
        //"module:GPMO " + //Nur zum Test
        "  <" +
        moduleUri +
        "> " +
        "schema:citation ?literaturUri. " +
        "?literaturUri schema:headline ?titel. " +
        "OPTIONAL { ?literaturUri schema:datePublished ?datePublished. } " +
        //Optionale Angaben Autor
        "OPTIONAL { " +
        "   ?literaturUri schema:itemListElement ?autorList . " +
        " ?autorList schema:identifier ?autorUri . " +
        "   OPTIONAL { ?autorUri  schema:givenName ?autorVorname. } " +
        "   OPTIONAL { ?autorUri  schema:familyName ?autorNachname. } " +
        "   OPTIONAL { ?autorUri  schema:sameAs ?autorProfilLink. } " +
        "} " +
        //Optionale Angaben Book
        "OPTIONAL { " +
        "   ?literaturUri a schema:Book. " +
        "   OPTIONAL { ?literaturUri schema:bookEdition ?auflage. } " +
        "   OPTIONAL { ?literaturUri schema:isbn ?isbn. } " +
        "} " +
        // Optionale Angaben Book-Identifier (DOI)
        "OPTIONAL { ?literaturUri schema:identifier ?litIdentifier. } " +
        //Optionale Angaben Article
        "OPTIONAL { " +
        "   ?literaturUri a schema:Article. " +
        "   OPTIONAL { ?literaturUri schema:pageStart ?pageStart;  " +
        "                            schema:pageEnd ?pageEnd. } " +
        "} " +
        //Optionale Angaben DigitalDocument - Keine expliziten Angaben
        //"OPTIONAL { ?literaturUri a schema:DigitalDocument; "} " +

        //Optionale Angaben zum Herausgeber (für Book + DigitalDocument)
        "OPTIONAL { " +
        "   ?literaturUri dc:publisher ?publisherName. " +
        "} " +
        "} " + //Schließende Klammer 1. Optional
        "}"; //Schließende Klammer vom WHERE
      //SPARQL-Abfrage Log-Ausgabe
      return SVGqueryLiteratur;
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
