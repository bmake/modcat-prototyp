import re
i = 1
while i<73:
    file = open("ModDescr_"+str(i)+".txt", "r")
    s0 = file.read()
    file.close()
    x1 = re.match(r".*(?=  Studiensemester:?)", s0)
#    print(x1.group(0))
    s1b = s0[x1.span()[1]:]
    s1 = re.sub("  Studiensemester:?  ","",s1b)
    x2 = re.match(r".*(?=  Modulverantwortliche\(r\):)", s1)
    s2b = s1[x2.span()[1]:]
#    print(x2.group(0))
    s2 = re.sub("  Modulverantwortliche\(r\):  ", "", s2b)
    x3 = re.match(r".*(?=  Dozent\(in\):)", s2)
    s3b = s2[x3.span()[1]:]
#    print(x3.group(0))
    s3 = re.sub("  Dozent\(in\):  ", "", s3b)
    x4 = re.match(r".*(?= ? ?Sprache:)", s3)
    s4b = s3[x4.span()[1]:]
#    print(x4.group(0))
    s4 = re.sub(" ? ?Sprache:  ", "", s4b)
    x5 = re.match(r".*(?= ? ?Zuordnung zum Curriculum:)", s4)
    s5b = s4[x5.span()[1]:]
#    print(x5.group(0))
    s5 = re.sub(" ? ?Zuordnung zum Curriculum:  ", "", s5b)
    x6 = re.match(r".*(?= ? ?Lehrform ?/ ?SWS:)", s5)
    s6b = s5[x6.span()[1]:]
#    print(x6.group(0))
    s6 = re.sub(" ? ?Lehrform ?/ ?SWS:  ", "", s6b)
    x7 = re.match(r".*(?= ? ?Arbeitsaufwand:)", s6)
    s7b = s6[x7.span()[1]:]
#    print(str(i) + " " + x7.group(0))
    s7 = re.sub(" ? ?Arbeitsaufwand:  ", "", s7b)
    x8 = re.match(r".*(?= ? ?Kreditpunkte:)", s7)
    s8b = s7[x8.span()[1]:]
#    print(x8.group(0))
    s8 = re.sub(" ? ?Kreditpunkte:  ", "", s8b)
    x9 = re.match(r".*(?= ? ?Voraussetzungen nach .*?ordnung)", s8)
    s9b = s8[x9.span()[1]:]
#    print(x9.group(0))
    s9 = re.sub(" ? ?Voraussetzungen nach .*?ordnung:? ? ?", "", s9b)
    x10 = re.match(r".*(?= ? ?Empfohlene Voraussetzungen:)", s9)
    s10b = s9[x10.span()[1]:]
#    print(x10.group(0))
    s10 = re.sub(" ? ?Empfohlene Voraussetzungen: ? ?", "", s10b)
    x11 = re.match(r".*(?= ? ?Angestrebte Lernergebnisse:?)", s10)
    s11b = s10[x11.span()[1]:]
#    print(str(i) + " " + x11.group(0))
    s11 = re.sub(" ? ?Angestrebte Lernergebnisse:? ? ?", "", s11b)
    x12 = re.match(r".*(?= ? ?Inhalt:)", s11)
    s12b = s11[x12.span()[1]:]
#    print(x12.group(0))
    s12 = re.sub(" ? ?Inhalte?:?  ?", "", s12b)
    x13 = re.match(r".*(?= ?Studien-?/?(- und )? ?Pr.fungsleistungen:? ? ?)", s12)
    s13b = s12[x13.span()[1]:]
#    print(x13.group(0))
    s13 = re.sub("Studien.*?leistungen:? ?", "", s13b)
    x14 = re.match(r".*(?= ? ?Medienformen:? ? ?)", s13)
    s14b = s13[x14.span()[1]:]
#    print(x14.group(0))
    s14 = re.sub(" ? ?Medienformen:? ? ?", "", s14b)
    x15 = re.match(r".*(?= ? ?Literatur: ? ?)", s14)
    s15b = s14[x15.span()[1]:]
#    print(x15.group(0))
    s15 = re.sub(" ? ?Literatur: ? ?", "", s15b)
    print(s15)
    i+=1