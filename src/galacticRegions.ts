/** Broad region silhouettes hand-traced from the user-supplied DK galaxy reference.
 * Source image: star_wars_galaxy_map_4000x4000_20251009_3c4d0e08.jpeg.
 * Trace coordinates use a 1600px reference view, not surveyed borders or a new
 * canonical coordinate dataset. Grid centers align with the published A–U grid.
 * Regions are geography, not era-specific faction control. Hutt Space is an overlay.
 */
export type MapPoint = readonly [number, number]
export const REGION_REFERENCE = {
  title: 'User-supplied Star Wars Galaxy Map (DK cartographic reference)',
  filename: 'star_wars_galaxy_map_4000x4000_20251009_3c4d0e08.jpeg',
  companionUrl: 'http://www.swgalaxymap.com/',
  precision: 'Approximate hand-traced region silhouettes aligned to the reference grid; not exact borders.',
  // C center=276.08; K center=742; row 11 center=915.2 (1600px rendition).
  gridCalibration: { centerK: 742, centerRow11: 915.2, cell: 58.24 },
}
export function referencePoint(x: number, y: number): [number, number] {
  const { centerK, centerRow11, cell } = REGION_REFERENCE.gridCalibration
  return [(x - centerK) / cell, (centerRow11 - y) / cell]
}
export type GalacticRegion = {
  id: string; name: string; color: string; points: MapPoint[];
  label: MapPoint; inner?: string; overlay?: boolean;
}
const trace = (points: number[][]): MapPoint[] => points.map(([x, y]) => referencePoint(x, y))
export const GALACTIC_REGIONS: GalacticRegion[] = [
  { id: 'outer-rim', name: 'OUTER RIM', color: '#5eabcf', label: referencePoint(887, 440), inner: 'mid-rim', points: trace([
    [545,615],[592,593],[637,570],[653,529],[684,497],[682,455],[718,432],[747,430],[754,398],[775,356],[817,341],[864,340],[914,358],[949,386],[952,404],[931,411],[934,442],[987,444],[1016,436],[1066,449],[1067,431],[1093,424],[1142,438],[1191,457],[1224,487],[1252,535],[1290,570],[1310,617],[1329,656],[1353,707],[1354,771],[1327,813],[1338,871],[1336,936],[1323,988],[1317,1052],[1303,1114],[1306,1160],[1283,1223],[1261,1277],[1224,1310],[1183,1303],[1162,1330],[1118,1364],[1089,1391],[1045,1420],[1008,1431],[999,1462],[952,1472],[900,1479],[854,1468],[805,1476],[758,1472],[720,1488],[686,1462],[661,1440],[611,1434],[586,1413],[547,1409],[516,1373],[509,1337],[483,1303],[469,1255],[485,1214],[512,1180],[536,1137],[546,1078],[540,1018],[540,957],[542,895],[548,834],[557,774],[571,717],[590,669],[617,638],[576,636]
  ]) },
  { id: 'mid-rim', name: 'MID RIM', color: '#c56b95', label: referencePoint(601,695), inner: 'expansion', points: trace([
    [546,873],[556,806],[571,739],[592,686],[625,649],[664,626],[714,615],[773,615],[825,622],[854,645],[862,670],[899,683],[957,686],[1004,679],[1059,659],[1103,663],[1145,677],[1170,706],[1182,752],[1180,811],[1195,865],[1198,922],[1183,971],[1178,1032],[1176,1087],[1164,1148],[1148,1200],[1116,1241],[1068,1263],[1013,1274],[964,1291],[918,1314],[872,1342],[819,1357],[768,1345],[716,1323],[670,1295],[630,1262],[600,1226],[575,1183],[551,1141],[550,1086],[544,1032],[542,975],[543,921]
  ]) },
  { id: 'expansion', name: 'EXPANSION REGION', color: '#61bac9', label: referencePoint(610,758), inner: 'inner-rim', points: trace([
    [565,897],[578,830],[596,769],[618,724],[651,699],[688,696],[729,708],[775,714],[819,710],[859,696],[893,682],[925,691],[962,719],[990,754],[1015,796],[1028,847],[1047,889],[1060,936],[1060,982],[1066,1025],[1062,1063],[1045,1108],[1027,1141],[1001,1158],[966,1168],[941,1185],[914,1206],[872,1219],[828,1224],[786,1225],[744,1215],[704,1192],[662,1161],[628,1132],[601,1095],[580,1058],[568,1010],[561,956]
  ]) },
  { id: 'inner-rim', name: 'INNER RIM', color: '#d29a76', label: referencePoint(639,800), inner: 'colonies', points: trace([
    [592,912],[604,853],[626,805],[654,758],[684,723],[719,725],[754,737],[790,741],[824,728],[857,707],[888,703],[917,719],[943,742],[970,767],[991,797],[1005,832],[1004,863],[984,891],[970,922],[957,954],[946,987],[943,1022],[939,1065],[917,1105],[886,1127],[850,1134],[807,1143],[764,1140],[720,1124],[682,1109],[652,1091],[625,1066],[604,1034],[593,997],[589,957]
  ]) },
  { id: 'colonies', name: 'COLONIES', color: '#a88ebd', label: referencePoint(671,839), inner: 'core', points: trace([
    [616,913],[627,865],[647,831],[676,807],[710,795],[745,791],[781,790],[817,803],[847,824],[869,852],[885,886],[901,924],[911,960],[915,995],[905,1028],[882,1055],[853,1071],[819,1082],[786,1083],[749,1077],[713,1065],[681,1048],[654,1021],[633,990],[621,953]
  ]) },
  { id: 'core', name: 'CORE WORLDS', color: '#e1be5f', label: referencePoint(691,884), inner: 'deep-core', points: trace([
    [651,907],[658,873],[676,844],[702,825],[731,816],[762,816],[790,827],[817,844],[841,867],[858,895],[874,922],[884,952],[885,978],[870,1001],[846,1017],[818,1028],[788,1030],[758,1024],[729,1015],[702,1000],[679,979],[663,954],[654,930]
  ]) },
  { id: 'deep-core', name: 'DEEP CORE', color: '#c2c8d5', label: referencePoint(776,911), points: trace([
    [703,901],[711,879],[730,859],[751,852],[778,852],[800,864],[818,880],[834,903],[842,929],[837,950],[822,969],[798,981],[774,981],[750,973],[731,961],[715,942],[705,923]
  ]) },
  { id: 'hutt-space', name: 'HUTT SPACE', color: '#bf4a72', label: referencePoint(1247,925), overlay: true, points: trace([
    [1216,767],[1234,791],[1237,822],[1248,850],[1274,866],[1286,893],[1281,918],[1295,944],[1285,968],[1269,991],[1270,1016],[1258,1032],[1248,1060],[1230,1070],[1214,1062],[1214,1038],[1203,1013],[1187,993],[1165,976],[1143,956],[1134,931],[1139,904],[1148,877],[1153,849],[1176,842],[1194,844],[1205,823],[1207,796]
  ]) },
]
export const GALACTIC_REGION_LABELS = [
  ...GALACTIC_REGIONS.map(({id,name,label,color}) => ({id,name,position: [label[0],label[1],-.12] as [number,number,number],color})),
  {id:'unknown-regions',name:'UNKNOWN REGIONS',position:[-5.1,1.15,-.12] as [number,number,number],color:'#86a1b6'},
]
