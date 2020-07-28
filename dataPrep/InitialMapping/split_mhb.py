mhb_file = open("mhb_gesamt.txt","r",encoding="utf8")
mhb_gesamt = mhb_file.read()
mhb_file.close()
modDescrSeq = mhb_gesamt.split("Modulbezeichnung:  ")
i = 1
while i<len(modDescrSeq):
    fileName = "ModDescr_" + str(i)
    file = open(fileName + ".txt","w")
    file.write(modDescrSeq[i].strip())
    file.close()
    i += 1
