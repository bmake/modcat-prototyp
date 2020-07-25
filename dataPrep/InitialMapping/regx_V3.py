import re

actual_semester="WiSe_2018"
file= open("Modulkatalog Maschinenbau.txt", "r")


r=file.read()
file.close()
f= open("myfile.txt", "w")

f.write("""@prefix schema: <https://schema.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix module: <https://bmake.th-brandenburg.de/module/> .
@prefix wd: <http://www.wikidata.org/entity/> .
@prefix thb-fbwm: <https://www.th-brandenburg.de/mitarbeiterseiten/fbw/> .
@prefix xing: <https://www.xing.com/profile/> .
@prefix linkedIn: <https://www.linkedin.com/in/> .
@prefix resGate: <https://www.researchgate.net/profile/> .\n\n""")
 
pattern=re.compile(r'ggf. Kürzel:\s\S+\s\S+')
matches=pattern.finditer(r)
print(matches)
for i in matches:
    course_code =i[0].split(" ")
    f.write("course_code"+course_code)
    



pattern=re.compile(r'Modulbezeichnung:\s\S+\s\w+\s\w+')
matches=pattern.finditer(r)
for i in matches:
 
 Modulbezeichnung=i[0].split("\n")
 Modulbezeichnung[1]=Modulbezeichnung[1].replace(" ","")
 Modulbezeichnung[1]=Modulbezeichnung[1].replace("-","_")
 print(Modulbezeichnung)
 f.write("module:" +Modulbezeichnung[1] +" a schema:Course ;\n")
 f.write("   rdfs:label \""+Modulbezeichnung[2]+"\" ;\n")
 f.write("   schema:name \"" +Modulbezeichnung[2]+"\" ;\n")
 f.write("   schema:courseCode \"" +Modulbezeichnung[1]+"\" ;\n")
 


    
pattern=re.compile(r'Sprache:\s\w+')
matches=pattern.finditer(r)
for i in matches:
    
    Sprache=i[0].split(":")
    print (Sprache)
    f.write("   schema:inLanguage"+" \""+Sprache[1][1:3]+"\"; \n")
    
pattern=re.compile(r'Modulverantwortliche\(r\):\s\S+\s\S+')
matches=pattern.finditer(r)
print(matches)
for i in matches:
    
    Modulverantwortliche=i[0].split(":")
    Modulverantwortliche1=Modulverantwortliche[1].split(" ")
    print (Modulverantwortliche)
    Modulverantwortliche1[2]=Modulverantwortliche1[2].replace("ö","oe")
    Modulverantwortliche1[2]=Modulverantwortliche1[2].replace("ä","ae")
    Modulverantwortliche1[2]=Modulverantwortliche1[2].replace("ü","ue")
    f.write("   schema:accountablePerson thb-fbwm: "+Modulverantwortliche1[2]+ ";\n")

pattern=re.compile(r'Arbeitsaufwand:(?s)(.*)Kreditpunkte:')
matches=pattern.finditer(r)

for i in matches:
    
    x=i[0].split("Arbeitsaufwand:")
    y=x[1].split("Kreditpunkte:")
    Arbeitsaufwand=y[0]
    z=Arbeitsaufwand.split("davon")
    Gesamt_worload=z[0]
    Gesamt_worload=Gesamt_worload.replace(" ","")
    Gesamt_worload=Gesamt_worload.upper()
    
    
     

   # print (Arbeitsaufwand)
    f.write("   schema:timeRequired \"PT"+ Gesamt_worload +"\";\n")
    

pattern=re.compile(r'Kreditpunkte:\s\S+')
matches=pattern.finditer(r)
print(matches)
for i in matches:
    
    Kreditpunkte=i[0].split(" ")
    print (Kreditpunkte)
    f.write("   schema:educationalCredentialAwarded \""+Kreditpunkte[1]+ "\";\n")
    
f.write("   module:addProp_TeachingForms module:TeachingForms_"+Modulbezeichnung[1]+";\n")
f.write("   module:addProp_CompWL module:CompWL_"+Modulbezeichnung[1]+";\n")


	
f.write("   module:about_LResults module:LResults_"+Modulbezeichnung[1]+";\n") 
f.write("   module:about_Content module:Content_"+Modulbezeichnung[1]+";\n")
f.write("   module:about_Exam module:Exam_"+Modulbezeichnung[1]+";\n") 


  
f.write("   schema:hasCourseInstance module:"+actual_semester+ Modulbezeichnung[1]+" ;\n")
f.write("   module:eduAlignm_Curr module:Curr_"+Modulbezeichnung[1]+";\n")
f.write("   module:eduAlignm_ModuleType module:ModuleType_"+Modulbezeichnung[1]+ ";\n")
f.write("   module:eduAlignm_SWS module:SWS_"+Modulbezeichnung[1]+";\n")
f.write("   module:eduAlignm_Grade module:Grade_"+Modulbezeichnung[1]+ ".\n\n")

pattern=re.compile(r'Angebotsturnus:\s\S+\s\w+\s\w+')
matches=pattern.finditer(r)
for i in matches:
 
 Semester=i[0].split("zum")
 
 print(Semester)
 
f.write("## for CourseInstances\n")
f.write("module:"+ actual_semester +Modulbezeichnung[1]+" a schema:CourseInstance ; \n")
f.write("   schema:courseMode \"jedes "+Semester[1]+"\"; \n" )

f.write("   schema:duration \"P0.5Y\" ;\n")
f.write("   schema:identifier \""+Modulbezeichnung[1]+" "+actual_semester+"\" ;\n")

pattern=re.compile(r'Dozent\(in\):\s\S+\s\S+\s\S+\s\S+')
matches=pattern.finditer(r)

for i in matches:
 
 Dozent=i[0].split(":")
 Dozent1=Dozent[1].split(",")
 print(Dozent1)
 x=Dozent1[0]
 y=Dozent1[1]
 x=x.split(" ")
 x[2]=x[2].replace("ö","oe")
 x[2]=x[2].replace("ä","ae")
 x[2]=x[2].replace("ü","ue")
 y=y.split(" ")
 y[2]=y[2].replace("ö","oe")
 y[2]=y[2].replace("ä","ae")
 y[2]=y[2].replace("ü","ue")
 
 
 
 f.write("   schema:instructor thb-fbwm:" + x[2] + ",thb-fbwm:" +y[2] +".\n\n")



f.write("## for didactic parts of a course (additionalProperty): Lehrformen & Aufteilung Workload \n")
f.write("module:CompWL_"+Modulbezeichnung[1]+" a schema:PropertyValue ; \n")
f.write("   schema:identifier \"Workload\" ; \n   schema:name \"Aufteilung der Workload in Stunden\" ;\n")
f.write("   schema:valueReference module:WL1_" +Modulbezeichnung[1]+", module:WL2_"+Modulbezeichnung[1]+".\n")
f.write("module:WL1_"+Modulbezeichnung[1]+" a schema:PropertyValue ;\n")
a=Arbeitsaufwand.split("davon")
b=a[1].split(",")
arbeitsaufwand1=b[0].split("h")
arbeitsaufwand2=b[1].split("h")
f.write("   schema:name \"Präsenzstudium\"  ;\n")
f.write("   schema:value"+ arbeitsaufwand1[0]+" . \n")
f.write("module:WL2_"+Modulbezeichnung[1]+" a schema:PropertyValue ;\n")
f.write("   schema:name \"Selbststudium\"  ;\n")
f.write("   schema:value"+ arbeitsaufwand2[0]+" . \n\n")

  
f.write("## for ItemLists (about): Learning Results, Content, Examination Forms \n")
f.write("module:LResults_"+Modulbezeichnung[1]+" a schema:ItemList ;\n")
f.write("   schema:identifier \"Results\" ;\n")
f.write("   schema:name \"Lernergebnisse "+Modulbezeichnung[1] +"\" ;\n")
pattern=re.compile(r'Lernergebnisse:(?s)(.*)Inhalt:')
matches=pattern.finditer(r)
print(matches)
for i in matches:
    x=i[0].split("Lernergebnisse:\n")
    Lernergebnisse=x[1].split("\nInhalt:")
    
    print(y[0])
Lernergebnisse[0]=Lernergebnisse[0].replace("\n"," ")   
f.write("   schema:itemListElement \""+Lernergebnisse[0]+"\". \n")

f.write("module:Content_"+Modulbezeichnung[1]+" a schema:ItemList ;\n")
f.write("   schema:identifier \"Content\" ;\n")
f.write("   schema:name \"Inhalt "+Modulbezeichnung[1] +"\" ;\n")
pattern=re.compile(r'Inhalt:(?s)(.*)Studien- Prüfungsleistungen:')
matches=pattern.finditer(r)

for i in matches:
    x=i[0].split("Inhalt:\n")
    Inhalt=x[1].split("\nStudien- Prüfungsleistungen:")
    
    print(Inhalt[0])
Inhalt[0]=Inhalt[0].replace("\n"," ")
l = re.compile("\d\.").split(Inhalt[0])

   
f.write("   schema:itemListElement \""+l[1].lstrip()+"\" \n")
for i in  range(2, len(l)):
    if i<len(l)-1:
       f.write("   \""+l[i].strip()+"\"\n")
    else:
       f.write("   \""+l[i].strip()+"\".\n")
    
  



f.write("module:Exam_"+Modulbezeichnung[1]+" a schema:ItemList ;\n")
f.write("   schema:identifier \"Exam\" ;\n")
f.write("   schema:name \"Studien-/Prüfungsleistungen "+Modulbezeichnung[1] +"\" ;\n")
pattern=re.compile(r'Studien- Prüfungsleistungen:(?s)(.*)Medienformen:')
matches=pattern.finditer(r)

for i in matches:
    x=i[0].split("Studien- Prüfungsleistungen:\n")
    Prüfungsleistungen=x[1].split("\nMedienformen:")
    
    print(Prüfungsleistungen[0])

  
Prüfungsleistungen[0]=Prüfungsleistungen[0].replace("\n"," ")
l1 = re.compile("\·").split(Prüfungsleistungen[0])  


   
f.write("   schema:itemListElement ")
for i in  range(1, len(l1)):
    if i<len(l)-2:
       f.write("   \""+l1[i].strip()+"\"\n")
    else:
       f.write("   \""+l1[i].strip()+"\".\n")
    
f.write ("\n")   
    


f.write("## for AlignmentObjects \n")
f.write("module:Curr_"+Modulbezeichnung[1]+" a schema:AlignmentObject ;\n")
f.write("   schema:alignmentType \"Zuordnung zum Curriculum\" ; \n")


pattern=re.compile(r'Zuordnung zum Curriculum\s\S+\s\S+\s\S+\s\S+\s\S+')
matches=pattern.finditer(r)
        
for i in matches:
 
 Zuordnung=i[0].split(" ")
 
f.write("   schema:targetName \"Zuordnung zum Curriculum\";\n")			
f.write("   schema:targetDescription \"" +Zuordnung[3]+ Zuordnung[4] +Zuordnung[5] +Zuordnung[6] +"\".\n\n")

f.write("module:ModuleType_"+Modulbezeichnung[1]+" a schema:AlignmentObject ;\n")
f.write("   schema:alignmentType \"Modultyp\" ; \n")

pattern=re.compile(r'Zuordnung zum Curriculum\s\S+\s\S+\s\S+\s\S+\s\S+')
matches=pattern.finditer(r)

        
for i in matches:
 
 Zuordnung =i[0].split(",")
 print(Zuordnung )
f.write("   schema:targetName \""+Zuordnung[2].lstrip() +"\".\n")

print (l1)

f.close()

