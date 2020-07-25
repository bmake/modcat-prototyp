mhb_file = open("mhb_gesamt.txt","r",1000,"utf8")
mhb_gesamt = mhb_file.read()
mhb_file.close()
modDescrSeq = mhb_gesamt.split("Modulbezeichnung:  ")
countModDescr = len(modDescrSeq)
#s = modDescrSeq[1].strip()
#print(s)
i = 1
while i<countModDescr:
    fileName = "ModDescr_" + str(i)
    file = open(fileName + ".txt","w")
    s = modDescrSeq[i].strip()
    file.write(s)
    file.close()
    i += 1
