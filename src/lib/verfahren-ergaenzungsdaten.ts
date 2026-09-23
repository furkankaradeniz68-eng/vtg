// Ergaenzungsdaten, die (noch) nicht Teil der BC-Schnittstelle sind: `aktenzeichen` und
// `landkreis` fehlen im gelieferten Feldmapping.md fuer vtgCompanies, obwohl sie im
// urspruenglichen Anforderungsdokument (BC-Schnittstelle-Konzept.pdf) vorgesehen waren.
// Bis die BC-Entwicklung diese zwei Felder nachliefert, dient diese aus dem alten
// CSV-Export uebernommene Zuordnung (nr -> Aktenzeichen/Landkreis) als Fallback.
export type VerfahrenErgaenzung = { aktenzeichen: string; landkreis: string };

export const VERFAHREN_ERGAENZUNG: Record<string, VerfahrenErgaenzung> = {
  "11001": {
    "aktenzeichen": "AZ-11001",
    "landkreis": "Bernkastel-Wittlich"
  },
  "11003": {
    "aktenzeichen": "AZ-11003",
    "landkreis": "Bernkastel-Wittlich"
  },
  "11004": {
    "aktenzeichen": "AZ-11004",
    "landkreis": "Bernkastel-Wittlich"
  },
  "11009": {
    "aktenzeichen": "AZ-11009",
    "landkreis": "Bernkastel-Wittlich"
  },
  "11021": {
    "aktenzeichen": "AZ-11021",
    "landkreis": "Bernkastel-Wittlich"
  },
  "11026": {
    "aktenzeichen": "AZ-11026",
    "landkreis": "Bernkastel-Wittlich"
  },
  "11057": {
    "aktenzeichen": "AZ-11057",
    "landkreis": "Bernkastel-Wittlich"
  },
  "11066": {
    "aktenzeichen": "AZ-11066",
    "landkreis": ""
  },
  "11067": {
    "aktenzeichen": "AZ-11067",
    "landkreis": "Bernkastel-Wittlich"
  },
  "11075": {
    "aktenzeichen": "AZ-11075",
    "landkreis": "Bernkastel-Wittlich"
  },
  "11093": {
    "aktenzeichen": "AZ-11093",
    "landkreis": "Bernkastel-Wittlich"
  },
  "11100": {
    "aktenzeichen": "AZ-11100",
    "landkreis": "Bernkastel-Wittlich"
  },
  "11105": {
    "aktenzeichen": "AZ-11105",
    "landkreis": "Bernkastel-Wittlich"
  },
  "11108": {
    "aktenzeichen": "AZ-11108",
    "landkreis": "Bernkastel-Wittlich"
  },
  "11113": {
    "aktenzeichen": "AZ-11113",
    "landkreis": "Trier-Saarburg"
  },
  "11114": {
    "aktenzeichen": "AZ-11114",
    "landkreis": "Bernkastel-Wittlich"
  },
  "11115": {
    "aktenzeichen": "AZ-11115",
    "landkreis": "Bernkastel-Wittlich"
  },
  "11117": {
    "aktenzeichen": "AZ-11117",
    "landkreis": "Bernkastel-Wittlich"
  },
  "11118": {
    "aktenzeichen": "AZ-11118",
    "landkreis": "Bernkastel-Wittlich"
  },
  "11121": {
    "aktenzeichen": "AZ-11121",
    "landkreis": "Bernkastel-Wittlich"
  },
  "11125": {
    "aktenzeichen": "AZ-11125",
    "landkreis": "Bernkastel-Wittlich"
  },
  "11861": {
    "aktenzeichen": "UV6316A",
    "landkreis": "BKS-WI"
  },
  "11880": {
    "aktenzeichen": "UV6319L",
    "landkreis": "BKS-WI"
  },
  "11913": {
    "aktenzeichen": "11913",
    "landkreis": "Bernkastel-Wittlich"
  },
  "11965": {
    "aktenzeichen": "VV6709W",
    "landkreis": "BKS-WI"
  },
  "19003": {
    "aktenzeichen": "AZ-19003",
    "landkreis": "Bernkastel-Wittlich"
  },
  "19026": {
    "aktenzeichen": "AZ-19026",
    "landkreis": "Bernkastel-Wittlich"
  },
  "21022": {
    "aktenzeichen": "AZ-21022",
    "landkreis": "Kusel"
  },
  "21036": {
    "aktenzeichen": "AZ-21036",
    "landkreis": "Kaiserslautern"
  },
  "21037": {
    "aktenzeichen": "AZ-21037",
    "landkreis": "Kusel"
  },
  "21044": {
    "aktenzeichen": "AZ-21044",
    "landkreis": "Kusel"
  },
  "21053": {
    "aktenzeichen": "AZ-21053",
    "landkreis": "Kusel"
  },
  "21056": {
    "aktenzeichen": "AZ-21056",
    "landkreis": "Südwestpfalz"
  },
  "21066": {
    "aktenzeichen": "AZ-21066",
    "landkreis": "Südwestpfalz"
  },
  "21067": {
    "aktenzeichen": "AZ-21067",
    "landkreis": "Kusel"
  },
  "21072": {
    "aktenzeichen": "AZ-21072",
    "landkreis": "Kaiserslautern"
  },
  "21089": {
    "aktenzeichen": "AZ-21089",
    "landkreis": "Kusel"
  },
  "21090": {
    "aktenzeichen": "AZ-21090",
    "landkreis": ""
  },
  "21112": {
    "aktenzeichen": "AZ-21112",
    "landkreis": ""
  },
  "21113": {
    "aktenzeichen": "AZ-21113",
    "landkreis": ""
  },
  "21119": {
    "aktenzeichen": "AZ-21119",
    "landkreis": "Kusel"
  },
  "21120": {
    "aktenzeichen": "AZ-21120",
    "landkreis": "Donnersbergkreis"
  },
  "21122": {
    "aktenzeichen": "AZ-21122",
    "landkreis": "Kusel"
  },
  "21126": {
    "aktenzeichen": "AZ-21126",
    "landkreis": "Donnersbergkreis"
  },
  "21129": {
    "aktenzeichen": "AZ-21129",
    "landkreis": ""
  },
  "21130": {
    "aktenzeichen": "AZ-21130",
    "landkreis": ""
  },
  "21137": {
    "aktenzeichen": "AZ-21137",
    "landkreis": "Donnersbergkreis"
  },
  "21141": {
    "aktenzeichen": "AZ-21141",
    "landkreis": ""
  },
  "21148": {
    "aktenzeichen": "AZ-21148",
    "landkreis": "Kaiserslautern"
  },
  "21159": {
    "aktenzeichen": "AZ-21159",
    "landkreis": ""
  },
  "21176": {
    "aktenzeichen": "AZ-21176",
    "landkreis": "Zweibrücken Landkreisfr. Stadt Zweibrücken"
  },
  "21179": {
    "aktenzeichen": "AZ-21179",
    "landkreis": "Kusel"
  },
  "21184": {
    "aktenzeichen": "AZ-21184",
    "landkreis": "Kaiserslautern"
  },
  "21200": {
    "aktenzeichen": "AZ-21200",
    "landkreis": "Donnersbergkreis"
  },
  "21201": {
    "aktenzeichen": "AZ-21201",
    "landkreis": "Kaiserslautern"
  },
  "21326": {
    "aktenzeichen": "AZ-21326",
    "landkreis": "Südwestpfalz"
  },
  "21480": {
    "aktenzeichen": "534-03-431",
    "landkreis": "KIB"
  },
  "21583": {
    "aktenzeichen": "534-03-550",
    "landkreis": "KIB"
  },
  "21636": {
    "aktenzeichen": "534-03-550",
    "landkreis": "DO"
  },
  "21702": {
    "aktenzeichen": "AZ-21702",
    "landkreis": "Kaiserslautern"
  },
  "21854": {
    "aktenzeichen": "VV5533S",
    "landkreis": "Donnersbergkreis"
  },
  "29122": {
    "aktenzeichen": "AZ-29122",
    "landkreis": "Kusel"
  },
  "31033": {
    "aktenzeichen": "AZ-31033",
    "landkreis": "Ahrweiler"
  },
  "31064": {
    "aktenzeichen": "AZ-31064",
    "landkreis": ""
  },
  "31080": {
    "aktenzeichen": "AZ-31080",
    "landkreis": "Ahrweiler"
  },
  "31083": {
    "aktenzeichen": "AZ-31083",
    "landkreis": "Vulkaneifel"
  },
  "31124": {
    "aktenzeichen": "AZ-31124",
    "landkreis": "Cochem-Zell"
  },
  "31126": {
    "aktenzeichen": "AZ-31126",
    "landkreis": "Ahrweiler"
  },
  "31127": {
    "aktenzeichen": "AZ-31127",
    "landkreis": "Ahrweiler"
  },
  "31130": {
    "aktenzeichen": "AZ-31130",
    "landkreis": "Cochem-Zell"
  },
  "31148": {
    "aktenzeichen": "AZ-31148",
    "landkreis": "Mayen-Koblenz"
  },
  "31162": {
    "aktenzeichen": "AZ-31162",
    "landkreis": "Mayen-Koblenz"
  },
  "31170": {
    "aktenzeichen": "AZ-31170",
    "landkreis": "Ahrweiler"
  },
  "31218": {
    "aktenzeichen": "AZ-31218",
    "landkreis": "Cochem-Zell"
  },
  "31262": {
    "aktenzeichen": "AZ-31262",
    "landkreis": "Cochem-Zell"
  },
  "31270": {
    "aktenzeichen": "AZ-31270",
    "landkreis": "Mayen-Koblenz"
  },
  "31287": {
    "aktenzeichen": "AZ-31287",
    "landkreis": "Vulkaneifel"
  },
  "31290": {
    "aktenzeichen": "AZ-31290",
    "landkreis": "Cochem-Zell"
  },
  "31291": {
    "aktenzeichen": "AZ-31291",
    "landkreis": "Cochem-Zell"
  },
  "31311": {
    "aktenzeichen": "AZ-31311",
    "landkreis": "Cochem-Zell"
  },
  "31368": {
    "aktenzeichen": "AZ-31368",
    "landkreis": "Mayen-Koblenz"
  },
  "31493": {
    "aktenzeichen": "AZ-31493",
    "landkreis": "Ahrweiler"
  },
  "31495": {
    "aktenzeichen": "AZ-31495",
    "landkreis": "Ahrweiler"
  },
  "31497": {
    "aktenzeichen": "RF 3003 P",
    "landkreis": "Cochem-Zell"
  },
  "31623": {
    "aktenzeichen": "31410",
    "landkreis": "Mayen-Koblenz"
  },
  "39033": {
    "aktenzeichen": "AZ-39033",
    "landkreis": "Ahrweiler"
  },
  "41018": {
    "aktenzeichen": "AZ-41018",
    "landkreis": "Bad Dürkheim"
  },
  "41026": {
    "aktenzeichen": "AZ-41026",
    "landkreis": "Südliche Weinstraße"
  },
  "41038": {
    "aktenzeichen": "AZ-41038",
    "landkreis": "Südliche Weinstraße"
  },
  "41049": {
    "aktenzeichen": "AZ-41049",
    "landkreis": ""
  },
  "41075": {
    "aktenzeichen": "AZ-41075",
    "landkreis": "Rhein-Pfalz-Kreis"
  },
  "41086": {
    "aktenzeichen": "AZ-41086",
    "landkreis": "Bad Dürkheim"
  },
  "41121": {
    "aktenzeichen": "AZ-41121",
    "landkreis": ""
  },
  "41143": {
    "aktenzeichen": "AZ-41143",
    "landkreis": ""
  },
  "41155": {
    "aktenzeichen": "AZ-41155",
    "landkreis": "Bad Dürkheim"
  },
  "41156": {
    "aktenzeichen": "AZ-41156",
    "landkreis": "Südliche Weinstraße"
  },
  "41160": {
    "aktenzeichen": "AZ-41160",
    "landkreis": ""
  },
  "41163": {
    "aktenzeichen": "AZ-41163",
    "landkreis": ""
  },
  "41168": {
    "aktenzeichen": "AZ-41168",
    "landkreis": "DÜW/Rhein-Pfalz-Kreis"
  },
  "41175": {
    "aktenzeichen": "AZ-41175",
    "landkreis": ""
  },
  "41228": {
    "aktenzeichen": "AZ-41228",
    "landkreis": "Südliche Weinstraße"
  },
  "41230": {
    "aktenzeichen": "AZ-41230",
    "landkreis": "Bad Dürkheim"
  },
  "41240": {
    "aktenzeichen": "AZ-41240",
    "landkreis": "Südliche Weinstraße"
  },
  "41243": {
    "aktenzeichen": "AZ-41243",
    "landkreis": "SÜW/GER"
  },
  "41245": {
    "aktenzeichen": "AZ-41245",
    "landkreis": "Südliche Weinstraße"
  },
  "41250": {
    "aktenzeichen": "AZ-41250",
    "landkreis": "Bad Dürkheim"
  },
  "41255": {
    "aktenzeichen": "AZ-41255",
    "landkreis": "Bad Dürkheim"
  },
  "41256": {
    "aktenzeichen": "AZ-41256",
    "landkreis": "Südliche Weinstraße"
  },
  "41258": {
    "aktenzeichen": "AZ-41258",
    "landkreis": "Südliche Weinstraße"
  },
  "41261": {
    "aktenzeichen": "AZ-41261",
    "landkreis": "Germersheim"
  },
  "41262": {
    "aktenzeichen": "AZ-41262",
    "landkreis": "kreisfreie Stadt Landau"
  },
  "41264": {
    "aktenzeichen": "AZ-41264",
    "landkreis": "kreisfreie Stadt Landau"
  },
  "41272": {
    "aktenzeichen": "AZ-41272",
    "landkreis": "Bad Dürkheim u. Rhein-Pfalz-Kreis"
  },
  "41273": {
    "aktenzeichen": "AZ-41273",
    "landkreis": "Bad Dürkheim"
  },
  "41274": {
    "aktenzeichen": "AZ-41274",
    "landkreis": "Bad Dürkheim"
  },
  "41278": {
    "aktenzeichen": "AZ-41278",
    "landkreis": ""
  },
  "41281": {
    "aktenzeichen": "AZ-41281",
    "landkreis": "kreisfreie Stadt Landau"
  },
  "41286": {
    "aktenzeichen": "AZ-41286",
    "landkreis": "Südliche Weinstraße"
  },
  "41319": {
    "aktenzeichen": "AZ-41319",
    "landkreis": "Bad Dürkheim"
  },
  "41326": {
    "aktenzeichen": "AZ-41326",
    "landkreis": "Bad Dürkheim"
  },
  "41334": {
    "aktenzeichen": "AZ-41334",
    "landkreis": "Rhein-Pfalz-Kreis"
  },
  "41344": {
    "aktenzeichen": "AZ-41344",
    "landkreis": "Germersheim"
  },
  "41352": {
    "aktenzeichen": "AZ-41352",
    "landkreis": "Stadt Frankenthal"
  },
  "41377": {
    "aktenzeichen": "AZ-41377",
    "landkreis": "Germersheim"
  },
  "41385": {
    "aktenzeichen": "AZ-41385",
    "landkreis": "Südliche Weinstraße"
  },
  "41397": {
    "aktenzeichen": "AZ-41397",
    "landkreis": "Bad Dürkheim"
  },
  "41416": {
    "aktenzeichen": "AZ-41416",
    "landkreis": "Germersheim"
  },
  "41418": {
    "aktenzeichen": "AZ-41418",
    "landkreis": "Stadt Frankenthal"
  },
  "41436": {
    "aktenzeichen": "AZ-41436",
    "landkreis": "kreisfreie Stadt Landau"
  },
  "41506": {
    "aktenzeichen": "AZ-41506",
    "landkreis": "Bad Dürkheim"
  },
  "41631": {
    "aktenzeichen": "AZ-41631",
    "landkreis": "Germersheim"
  },
  "41651": {
    "aktenzeichen": "NN",
    "landkreis": "SÜW"
  },
  "41784": {
    "aktenzeichen": "RF 4836 F",
    "landkreis": "DÜW"
  },
  "41799": {
    "aktenzeichen": "RF48552W",
    "landkreis": "DÜW"
  },
  "41863": {
    "aktenzeichen": "AZ-41863",
    "landkreis": "kreisfreie Stadt Neustadt"
  },
  "41878": {
    "aktenzeichen": "VV4867N",
    "landkreis": "GER"
  },
  "41952": {
    "aktenzeichen": "AZ-41952",
    "landkreis": "kreisfreie Stadt Landau"
  },
  "41972": {
    "aktenzeichen": "VV4892W",
    "landkreis": "GER"
  },
  "41985": {
    "aktenzeichen": "AZ-41985",
    "landkreis": "kreisfreie Stadt Neustadt"
  },
  "42240": {
    "aktenzeichen": "AZ-42240",
    "landkreis": "Südliche Weinstraße"
  },
  "42631": {
    "aktenzeichen": "AZ-42631",
    "landkreis": "Germersheim"
  },
  "43009": {
    "aktenzeichen": "AZ-43009",
    "landkreis": "Rhein-Pfalz-Kreis"
  },
  "49230": {
    "aktenzeichen": "AZ-49230",
    "landkreis": "Bad Dürkheim"
  },
  "49250": {
    "aktenzeichen": "AZ-49250",
    "landkreis": "Bad Dürkheim"
  },
  "49274": {
    "aktenzeichen": "AZ-49274",
    "landkreis": "Bad Dürkheim"
  },
  "49436": {
    "aktenzeichen": "AZ-49436",
    "landkreis": "kreisfreie Stadt Landau"
  },
  "51024": {
    "aktenzeichen": "AZ-51024",
    "landkreis": "Daun"
  },
  "51026": {
    "aktenzeichen": "AZ-51026",
    "landkreis": "Bitburg-Prüm"
  },
  "51039": {
    "aktenzeichen": "AZ-51039",
    "landkreis": ""
  },
  "51040": {
    "aktenzeichen": "AZ-51040",
    "landkreis": ""
  },
  "51049": {
    "aktenzeichen": "AZ-51049",
    "landkreis": "Bitburg-Prüm"
  },
  "51062": {
    "aktenzeichen": "AZ-51062",
    "landkreis": "Vulkaneifel"
  },
  "51063": {
    "aktenzeichen": "AZ-51063",
    "landkreis": "Bitburg-Prüm"
  },
  "51066": {
    "aktenzeichen": "AZ-51066",
    "landkreis": "Bitburg-Prüm"
  },
  "51067": {
    "aktenzeichen": "AZ-51067",
    "landkreis": "Bitburg-Prüm"
  },
  "51070": {
    "aktenzeichen": "AZ-51070",
    "landkreis": "Bitburg-Prüm"
  },
  "51071": {
    "aktenzeichen": "AZ-51071",
    "landkreis": "Bitburg-Prüm"
  },
  "51072": {
    "aktenzeichen": "AZ-51072",
    "landkreis": "Eifelkreis Bitburg-Prüm"
  },
  "51077": {
    "aktenzeichen": "AZ-51077",
    "landkreis": "Bitburg-Prüm"
  },
  "51078": {
    "aktenzeichen": "AZ-51078",
    "landkreis": "Eifelkreis Bitburg-Prüm"
  },
  "51079": {
    "aktenzeichen": "AZ-51079",
    "landkreis": "Bitburg-Prüm"
  },
  "51081": {
    "aktenzeichen": "AZ-51081",
    "landkreis": "Vulkaneifel"
  },
  "51088": {
    "aktenzeichen": "AZ-51088",
    "landkreis": "Vulkaneifel"
  },
  "51099": {
    "aktenzeichen": "AZ-51099",
    "landkreis": ""
  },
  "51100": {
    "aktenzeichen": "AZ-51100",
    "landkreis": "Landkreis Vulkaneifel"
  },
  "51102": {
    "aktenzeichen": "AZ-51102",
    "landkreis": "Vulkaneifel"
  },
  "51111": {
    "aktenzeichen": "AZ-51111",
    "landkreis": "Vulkaneifel"
  },
  "51112": {
    "aktenzeichen": "AZ-51112",
    "landkreis": "Bitburg-Prüm"
  },
  "51137": {
    "aktenzeichen": "AZ-51137",
    "landkreis": "Bitburg-Prüm"
  },
  "51141": {
    "aktenzeichen": "AZ-51141",
    "landkreis": "Bitburg-Prüm"
  },
  "51143": {
    "aktenzeichen": "AZ-51143",
    "landkreis": "Bitburg-Prüm"
  },
  "51151": {
    "aktenzeichen": "AZ-51151",
    "landkreis": "Eifelkreis Bitburg-Prüm"
  },
  "51166": {
    "aktenzeichen": "AZ-51166",
    "landkreis": "Vulkaneifelkreis"
  },
  "51167": {
    "aktenzeichen": "AZ-51167",
    "landkreis": "Bitburg-Prüm"
  },
  "51170": {
    "aktenzeichen": "AZ-51170",
    "landkreis": "Bitburg-Prüm"
  },
  "51172": {
    "aktenzeichen": "AZ-51172",
    "landkreis": "Bitburg-Prüm"
  },
  "51175": {
    "aktenzeichen": "AZ-51175",
    "landkreis": "Bitburg-Prüm"
  },
  "51184": {
    "aktenzeichen": "AZ-51184",
    "landkreis": "Vulkaneifel"
  },
  "52024": {
    "aktenzeichen": "AZ-52024",
    "landkreis": "Daun"
  },
  "59079": {
    "aktenzeichen": "AZ-59079",
    "landkreis": "Bitburg-Prüm"
  },
  "59143": {
    "aktenzeichen": "AZ-59143",
    "landkreis": "Bitburg-Prüm"
  },
  "61033": {
    "aktenzeichen": "AZ-61033",
    "landkreis": "Birkenfeld"
  },
  "61089": {
    "aktenzeichen": "AZ-61089",
    "landkreis": "Rhein-Hunsrück-Kreis"
  },
  "61090": {
    "aktenzeichen": "AZ-61090",
    "landkreis": "Rhein-Hunsrück"
  },
  "61097": {
    "aktenzeichen": "AZ-61097",
    "landkreis": "Birkenfeld"
  },
  "61099": {
    "aktenzeichen": "AZ-61099",
    "landkreis": "Mainz-Bingen"
  },
  "61111": {
    "aktenzeichen": "AZ-61111",
    "landkreis": "Birkenfeld"
  },
  "61114": {
    "aktenzeichen": "AZ-61114",
    "landkreis": "Birkenfeld"
  },
  "61117": {
    "aktenzeichen": "AZ-61117",
    "landkreis": "Rhein-Hunsrück"
  },
  "61129": {
    "aktenzeichen": "AZ-61129",
    "landkreis": "Mainz-Bingen"
  },
  "61171": {
    "aktenzeichen": "AZ-61171",
    "landkreis": "Birkenfeld"
  },
  "61179": {
    "aktenzeichen": "AZ-61179",
    "landkreis": "Birkenfeld"
  },
  "61194": {
    "aktenzeichen": "AZ-61194",
    "landkreis": "Mainz-Bingen"
  },
  "61198": {
    "aktenzeichen": "AZ-61198",
    "landkreis": "Rhein-Hunsrück-Kreis"
  },
  "61202": {
    "aktenzeichen": "AZ-61202",
    "landkreis": "Birkenfeld"
  },
  "61213": {
    "aktenzeichen": "AZ-61213",
    "landkreis": "Simmern"
  },
  "63003": {
    "aktenzeichen": "AZ-63003",
    "landkreis": "Rhein-Hunsrück-Kreis"
  },
  "71002": {
    "aktenzeichen": "AZ-71002",
    "landkreis": "Trier-Saarburg"
  },
  "71025": {
    "aktenzeichen": "AZ-71025",
    "landkreis": "Trier-Saarburg"
  },
  "71028": {
    "aktenzeichen": "AZ-71028",
    "landkreis": "Trier-Saarburg"
  },
  "71031": {
    "aktenzeichen": "AZ-71031",
    "landkreis": "Trier-Saarburg"
  },
  "71032": {
    "aktenzeichen": "AZ-71032",
    "landkreis": "Stadt Trier"
  },
  "71067": {
    "aktenzeichen": "AZ-71067",
    "landkreis": ""
  },
  "71068": {
    "aktenzeichen": "AZ-71068",
    "landkreis": "Trier-Saarburg"
  },
  "71072": {
    "aktenzeichen": "AZ-71072",
    "landkreis": "Trier-Saarburg"
  },
  "71085": {
    "aktenzeichen": "AZ-71085",
    "landkreis": "Trier Saarburg"
  },
  "71089": {
    "aktenzeichen": "AZ-71089",
    "landkreis": "Trier-Saarburg"
  },
  "71110": {
    "aktenzeichen": "AZ-71110",
    "landkreis": "Trier-Saarburg"
  },
  "71114": {
    "aktenzeichen": "AZ-71114",
    "landkreis": ""
  },
  "71116": {
    "aktenzeichen": "AZ-71116",
    "landkreis": ""
  },
  "71122": {
    "aktenzeichen": "AZ-71122",
    "landkreis": "Trier-Saarburg"
  },
  "71124": {
    "aktenzeichen": "AZ-71124",
    "landkreis": ""
  },
  "71523": {
    "aktenzeichen": "VV6185W",
    "landkreis": "TR-S"
  },
  "73009": {
    "aktenzeichen": "AZ-73009",
    "landkreis": "Trier-Saarburg"
  },
  "79124": {
    "aktenzeichen": "AZ-79124",
    "landkreis": ""
  },
  "81020": {
    "aktenzeichen": "AZ-81020",
    "landkreis": "Rhein-Lahn-Kreis"
  },
  "81021": {
    "aktenzeichen": "AZ-81021",
    "landkreis": ""
  },
  "81022": {
    "aktenzeichen": "AZ-81022",
    "landkreis": "Rhein-Lahn-Kreis"
  },
  "81026": {
    "aktenzeichen": "AZ-81026",
    "landkreis": "Altenkirchen"
  },
  "81037": {
    "aktenzeichen": "AZ-81037",
    "landkreis": ""
  },
  "81038": {
    "aktenzeichen": "AZ-81038",
    "landkreis": ""
  },
  "81039": {
    "aktenzeichen": "AZ-81039",
    "landkreis": ""
  },
  "81069": {
    "aktenzeichen": "AZ-81069",
    "landkreis": ""
  },
  "81073": {
    "aktenzeichen": "AZ-81073",
    "landkreis": "Altenkirchen"
  },
  "81074": {
    "aktenzeichen": "AZ-81074",
    "landkreis": "Neuwied"
  },
  "81079": {
    "aktenzeichen": "AZ-81079",
    "landkreis": "Altenkirchen"
  },
  "81080": {
    "aktenzeichen": "AZ-81080",
    "landkreis": ""
  },
  "81112": {
    "aktenzeichen": "AZ-81112",
    "landkreis": ""
  },
  "81117": {
    "aktenzeichen": "AZ-81117",
    "landkreis": "Altenkirchen"
  },
  "81122": {
    "aktenzeichen": "AZ-81122",
    "landkreis": "Altenkirchen"
  },
  "81124": {
    "aktenzeichen": "AZ-81124",
    "landkreis": "Rhein-Lahn"
  },
  "81134": {
    "aktenzeichen": "AZ-81134",
    "landkreis": "Neuwied"
  },
  "81155": {
    "aktenzeichen": "AZ-81155",
    "landkreis": ""
  },
  "81159": {
    "aktenzeichen": "AZ-81159",
    "landkreis": "Rhein-Lahn-Kreis"
  },
  "81168": {
    "aktenzeichen": "AZ-81168",
    "landkreis": "Rhein-Lahn"
  },
  "81177": {
    "aktenzeichen": "AZ-81177",
    "landkreis": ""
  },
  "81182": {
    "aktenzeichen": "AZ-81182",
    "landkreis": "Rhein-Lahn"
  },
  "81189": {
    "aktenzeichen": "AZ-81189",
    "landkreis": "Rhein-Lahn"
  },
  "81193": {
    "aktenzeichen": "AZ-81193",
    "landkreis": "Rhein-Lahn-Kreis"
  },
  "81201": {
    "aktenzeichen": "AZ-81201",
    "landkreis": "Rhein-Lahn"
  },
  "81205": {
    "aktenzeichen": "AZ-81205",
    "landkreis": "Rhein-Lahn"
  },
  "89189": {
    "aktenzeichen": "AZ-89189",
    "landkreis": "Rhein-Lahn"
  },
  "89193": {
    "aktenzeichen": "AZ-89193",
    "landkreis": "Rhein-Lahn-Kreis"
  },
  "91003": {
    "aktenzeichen": "AZ-91003",
    "landkreis": "Mainz-Bingen"
  },
  "91203": {
    "aktenzeichen": "AZ-91203",
    "landkreis": ""
  },
  "91314": {
    "aktenzeichen": "AZ-91314",
    "landkreis": "Mainz-Bingen"
  },
  "91316": {
    "aktenzeichen": "AZ-91316",
    "landkreis": "Mainz-Bingen"
  },
  "91318": {
    "aktenzeichen": "AZ-91318",
    "landkreis": "Alzey-Worms"
  },
  "91321": {
    "aktenzeichen": "AZ-91321",
    "landkreis": "Alzey-Worms"
  },
  "91405": {
    "aktenzeichen": "534-03-431",
    "landkreis": "MZ"
  },
  "91439": {
    "aktenzeichen": "AZ-91439",
    "landkreis": "Mainz-Bingen"
  },
  "91579": {
    "aktenzeichen": "AZ-91579",
    "landkreis": "Mainz-Bingen"
  },
  "91609": {
    "aktenzeichen": "AZ-91609",
    "landkreis": "Mainz-Bingen"
  },
  "91610": {
    "aktenzeichen": "AZ-91610",
    "landkreis": "Mainz-Bingen"
  },
  "91678": {
    "aktenzeichen": "AZ-91678",
    "landkreis": "Mainz-Bingen"
  },
  "91695": {
    "aktenzeichen": "AZ-91695",
    "landkreis": "Mainz-Bingen"
  },
  "91713": {
    "aktenzeichen": "AZ-91713",
    "landkreis": "Alzey-Worms"
  },
  "91774": {
    "aktenzeichen": "AZ-91774",
    "landkreis": "Alzey-Worms"
  },
  "91782": {
    "aktenzeichen": "AZ-91782",
    "landkreis": "Mainz-Bingen"
  },
  "91806": {
    "aktenzeichen": "AZ-91806",
    "landkreis": "Mainz-Bingen"
  },
  "91808": {
    "aktenzeichen": "AZ-91808",
    "landkreis": "Mainz-Bingen"
  },
  "91809": {
    "aktenzeichen": "AZ-91809",
    "landkreis": "Mainz-Bingen"
  },
  "91810": {
    "aktenzeichen": "AZ-91810",
    "landkreis": "Mainz-Bingen"
  },
  "91859": {
    "aktenzeichen": "RF5538E",
    "landkreis": "Alzey-Worms"
  },
  "91901": {
    "aktenzeichen": "AZ-91901",
    "landkreis": "Mainz-Bingen"
  },
  "91902": {
    "aktenzeichen": "AZ-91902",
    "landkreis": "Mainz-Bingen"
  },
  "91984": {
    "aktenzeichen": "AZ-91984",
    "landkreis": "Alzey-Worms"
  },
  "93002": {
    "aktenzeichen": "AZ-93002",
    "landkreis": "Mainz-Bingen"
  },
  "93003": {
    "aktenzeichen": "AZ-93003",
    "landkreis": "Mainz-Bingen"
  },
  "93004": {
    "aktenzeichen": "AZ-93004",
    "landkreis": "Mainz-Bingen"
  },
  "99002": {
    "aktenzeichen": "AZ-99002",
    "landkreis": "Mainz-Bingen"
  },
  "99316": {
    "aktenzeichen": "AZ-99316",
    "landkreis": "Mainz-Bingen"
  }
};
