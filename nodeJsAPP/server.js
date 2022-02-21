const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const pool = require("./routes/pool")
const conn = require("./routes/conn")
const geocoder = require("./geocoder")
const turf = require("@turf/turf")
app.set('view engine', 'ejs');
app.use(cors({
    origin: '*',
}));

const stations = [[-9.65467, 30.45119], [-6.84022, 33.97717], [-6.89109, 33.98266], [-6.89037, 33.98014], [-6.89593, 33.97767], [-6.8963, 33.97412], [-9.15492, 30.22014], [-9.61212, 30.41996], [-9.35197, 30.50117], [-9.1967, 32.27054], [-8.87809, 32.15711], [-8.8853, 32.14703], [-9.24482, 32.30692], [-8.60661, 33.15892], [-8.86322, 32.16124], [-8.86238, 31.87623], [-8.50202, 31.58456], [-9.21984, 32.33019], [-9.10487, 32.55189], [-9.18422, 32.26729]];

const stationD = [-9.35197, 30.50117];
const station1 = [-9.250876, 30.434155];
const station2 = [-9.217694, 30.391813];
const station3 = [-9.185922, 30.342945];
const stationT = [-9.15492, 30.22014];
const stationsInLine1 = [stationD, station1, station3, stationT]

const tracklines = [
    [
        [-9.3521818, 30.499976099999998], [-9.3518946, 30.50058330000003], [-9.3517591, 30.5016758], [-9.3517996, 30.501525999999984], [-9.3517448, 30.501280599999987], [-9.351847, 30.500646099999983], [-9.3517988, 30.500787999999986], [-9.3517914, 30.50163909999999], [-9.3518063, 30.501699799999997], [-9.3518063, 30.501699799999997], [-9.3518956, 30.501486100000008], [-9.3519023, 30.501540099999986], [-9.3518721, 30.501598599999994], [-9.3518061, 30.5016258], [-9.3517323, 30.50161349999999], [-9.3516196, 30.50155199999999], [-9.3517591, 30.500939999999986], [-9.3521241, 30.500211800000017], [-9.352192, 30.49997279999998], [-9.3521785, 30.499932], [-9.3515415, 30.499694000000005], [-9.3515415, 30.499694000000005], [-9.3495473, 30.497764000000004], [-9.3487545, 30.497271799999993], [-9.345466, 30.494671600000032], [-9.3469703, 30.49212949999999], [-9.3510515, 30.485338100000007], [-9.3511081, 30.485065500000005], [-9.3491496, 30.484201], [-9.346452, 30.48394780000001], [-9.3460713, 30.48384700000001], [-9.3426233, 30.48395460000002], [-9.3421696, 30.483816000000004], [-9.332082, 30.486184800000004], [-9.3219411, 30.483757499999996], [-9.3121356, 30.480353000000008], [-9.3051103, 30.484278500000002], [-9.295048, 30.487014500000015], [-9.2844708, 30.487629500000025], [-9.2744865, 30.484821100000005], [-9.2643175, 30.487405100000004], [-9.2630413, 30.487323999999987], [-9.2641533, 30.484149099999968], [-9.2627095, 30.480516300000005], [-9.2562571, 30.473270799999995], [-9.2527063, 30.467311300000006], [-9.2520513, 30.458219799999995], [-9.2545903, 30.44934050000002], [-9.252407, 30.440490799999964], [-9.2504456, 30.43320080000001], [-9.2453028, 30.425313000000017], [-9.2382396, 30.418477300000006], [-9.2301285, 30.412683099999995], [-9.2242751, 30.408222499999994], [-9.2219203, 30.40312249999998], [-9.2203579, 30.399030999999994], [-9.2189326, 30.395205300000015], [-9.2175895, 30.392059000000017], [-9.2174986, 30.391950500000007], [-9.2175926, 30.391750599999966], [-9.2166895, 30.388903499999998], [-9.2151015, 30.384451299999995], [-9.2130385, 30.37859900000001], [-9.2111741, 30.37106150000001], [-9.2063511, 30.362971000000016], [-9.1987353, 30.356629499999983], [-9.1910978, 30.3502735], [-9.185704, 30.343132999999995], [-9.1856711, 30.3428976], [-9.1821353, 30.336862600000003], [-9.1771178, 30.328609999999998], [-9.1722733, 30.320467599999986], [-9.167509, 30.312291299999984], [-9.1650143, 30.303494299999997], [-9.1632831, 30.294448099999997], [-9.1615355, 30.285503300000002], [-9.1595621, 30.282966099999996], [-9.1538551, 30.278673800000007], [-9.1459618, 30.272744799999984], [-9.1380008, 30.2667206], [-9.1287334, 30.262542800000006], [-9.1202703, 30.257170599999995], [-9.1125021, 30.25116179999999], [-9.1123999, 30.2509553], [-9.1147885, 30.249372800000003], [-9.1178256, 30.24515380000001], [-9.1221446, 30.236808599999975], [-9.1283265, 30.232078099999995], [-9.133771, 30.227288000000016], [-9.1339726, 30.227099100000004], [-9.1362698, 30.229880800000004], [-9.1387148, 30.230339099999995], [-9.1491043, 30.231329999999986], [-9.1596241, 30.230842100000032], [-9.1596241, 30.230842100000032], [-9.1634795, 30.22484700000001], [-9.1636496, 30.224199499999983], [-9.159611, 30.222218799999993], [-9.1594131, 30.222219300000006], [-9.1581813, 30.224099599999974], [-9.1579491, 30.224278800000008], [-9.1574115, 30.224133500000008], [-9.1550753, 30.223112999999998], [-9.1550645, 30.223104300000003], [-9.1549391, 30.223063600000003], [-9.1549186, 30.223056], [-9.1549186, 30.223056], [-9.154696, 30.22294899999997], [-9.1512643, 30.221373500000013], [-9.1488776, 30.220300800000004], [-9.1486555, 30.22007910000002], [-9.149885, 30.217757000000006], [-9.1502213, 30.217742300000012], [-9.1503753, 30.217624999999998], [-9.1503398, 30.2176805], [-9.1503398, 30.2176805], [-9.1503398, 30.2176805], [-9.1503398, 30.2176805], [-9.1502865, 30.21773779999998], [-9.1501758, 30.2179115], [-9.1501758, 30.2179115], [-9.1501758, 30.2179115], [-9.1501758, 30.2179115], [-9.1501758, 30.2179115], [-9.1501758, 30.2179115], [-9.1501758, 30.2179115], [-9.1502211, 30.21783029999999], [-9.1502168, 30.217770599999966], [-9.1500633, 30.217686000000015], [-9.1499546, 30.217674000000002], [-9.1498645, 30.2177686], [-9.1486435, 30.219869999999986], [-9.1486371, 30.220073100000008], [-9.1505353, 30.22101949999997], [-9.1529423, 30.2221416], [-9.1549669, 30.223010099999996], [-9.1550073, 30.22302549999999], [-9.1553105, 30.223168299999998], [-9.1578616, 30.2243038], [-9.158116, 30.224201499999992], [-9.1590206, 30.22230749999997], [-9.1588741, 30.2221038], [-9.158776, 30.22189880000002], [-9.158858, 30.221778999999998], [-9.1600181, 30.222357799999997], [-9.1639756, 30.223982800000016], [-9.164071, 30.22409880000002], [-9.164071, 30.22409880000002], [-9.160372, 30.230415300000004], [-9.154289, 30.231158800000017], [-9.1446895, 30.231309999999993], [-9.1373345, 30.230267099999992], [-9.134592, 30.227979000000005], [-9.134062, 30.227625000000003], [-9.1269161, 30.232574499999984], [-9.12149, 30.238680299999984], [-9.117164, 30.246390299999987], [-9.1124816, 30.250829299999992], [-9.1124003, 30.250981100000004], [-9.1191545, 30.25632329999999], [-9.1275968, 30.261877600000005], [-9.1370116, 30.265914800000004], [-9.1449788, 30.271934099999996], [-9.1527583, 30.277769599999985], [-9.1583161, 30.2819655], [-9.1624493, 30.29026909999999], [-9.1641885, 30.299204099999997], [-9.1659288, 30.30831209999998], [-9.1700981, 30.31672650000003], [-9.1747965, 30.324778800000004], [-9.179657, 30.332825999999997], [-9.1846221, 30.340904300000005], [-9.188758, 30.347170599999984], [-9.1956206, 30.353979300000006], [-9.2032595, 30.360308099999983], [-9.2102678, 30.367081499999998], [-9.2115826, 30.372558600000005], [-9.213272, 30.379147499999988], [-9.2148833, 30.383764600000006], [-9.2163591, 30.387996], [-9.2175795, 30.391507599999983], [-9.2190485, 30.395621500000004], [-9.220312, 30.398958499999992], [-9.2215663, 30.40216200000002], [-9.2226158, 30.405034999999998], [-9.2226333, 30.405056799999997], [-9.2236221, 30.407573299999996], [-9.2299151, 30.412452500000015], [-9.2380473, 30.4181861], [-9.2450545, 30.4249875], [-9.2502894, 30.432801600000005], [-9.2524878, 30.440651000000003], [-9.2545713, 30.449529100000007], [-9.2520358, 30.458550599999995], [-9.252759, 30.467706800000002], [-9.2563246, 30.473280799999984], [-9.2627263, 30.4805133], [-9.2630225, 30.487192300000004], [-9.2631428, 30.487301000000002], [-9.2715663, 30.484924299999975], [-9.279241, 30.48616380000003], [-9.2895973, 30.488287600000007], [-9.2998375, 30.48579530000002], [-9.309014, 30.481483999999966], [-9.3112616, 30.48036950000001], [-9.3191273, 30.48276299999999], [-9.3288675, 30.486187099999995], [-9.339351, 30.48470760000002], [-9.3462196, 30.483680799999988], [-9.3511935, 30.484917600000003], [-9.3513055, 30.484997300000003], [-9.3492, 30.48849849999999], [-9.3454838, 30.494607599999995], [-9.3457998, 30.4949991], [-9.3505426, 30.498802499999996], [-9.3505426, 30.498802499999996], [-9.3510923, 30.499407599999998], [-9.3515991, 30.4997446], [-9.352022, 30.499849100000006], [-9.352122, 30.499860600000005], [-9.3521788, 30.499922800000007], [-9.3518771, 30.500593299999977], [-9.351796, 30.501631099999997], [-9.3518046, 30.501649799999996], [-9.3517768, 30.501322500000015], [-9.3519793, 30.500365000000016], [-9.3518153, 30.500698599999993], [-9.3518141, 30.501636300000015], [-9.3518173, 30.501659099999998], [-9.3518173, 30.501659099999998], [-9.3518413, 30.501493800000006], [-9.3518696, 30.501555300000007], [-9.3518426, 30.501618800000003], [-9.3517888, 30.501646799999975], [-9.3516785, 30.501588000000012], [-9.3516521, 30.501419800000008], [-9.3516521, 30.501419800000008], [-9.3516521, 30.501419800000008], [-9.3516521, 30.501419800000008], [-9.3516521, 30.501419800000008], [-9.3516521, 30.501419800000008], [-9.3516521, 30.501419800000008], [-9.3516521, 30.501419800000008], [-9.3516521, 30.501419800000008], [-9.3516521, 30.501419800000008], [-9.3516521, 30.501419800000008], [-9.3516543, 30.501416500000005], [-9.351911, 30.50057480000001], [-9.3520358, 30.500354599999994], [-9.3522821, 30.4998583], [-9.3520813, 30.499744100000015], [-9.3520813, 30.499744100000015], [-9.3520813, 30.499744100000015], [-9.3520813, 30.499744100000015], [-9.3520813, 30.499744100000015], [-9.3520813, 30.499744100000015], [-9.3520813, 30.499744100000015], [-9.3520813, 30.499744100000015], [-9.3520813, 30.499744100000015], [-9.3520813, 30.499744100000015], [-9.3520813, 30.499744100000015], [-9.3520813, 30.499744100000015], [-9.3520813, 30.499744100000015]
    ],
    [
        [-9.1547888, 30.220874100000003], [-9.1554166, 30.221103999999983], [-9.1555421, 30.2211111], [-9.1559554, 30.2206733], [-9.1561243, 30.22058959999997], [-9.1577555, 30.221213300000016], [-9.1577723, 30.221223100000003], [-9.1578855, 30.221273999999994], [-9.1579408, 30.2212768], [-9.1579408, 30.2212768], [-9.1586006, 30.221763600000003], [-9.1589101, 30.221774299999993], [-9.159042, 30.221772599999994], [-9.1592521, 30.2219951], [-9.1600243, 30.222394100000002], [-9.1639585, 30.223961799999998], [-9.1640615, 30.22410049999999], [-9.1640615, 30.22410049999999], [-9.1603751, 30.23043730000002], [-9.1523031, 30.231243999999975], [-9.1428681, 30.23052650000001], [-9.1414511, 30.230369999999994], [-9.1341296, 30.227675000000005], [-9.1273215, 30.232416], [-9.121937, 30.237242500000008], [-9.1176543, 30.24556580000001], [-9.1124386, 30.25084680000002], [-9.1123846, 30.25100209999998], [-9.1184385, 30.255830599999996], [-9.1266943, 30.2614095], [-9.1362685, 30.265376500000002], [-9.1442103, 30.2713588], [-9.1518908, 30.277143499999994], [-9.155712, 30.280017299999997], [-9.1600611, 30.283280500000004], [-9.1616778, 30.286155800000003], [-9.1633896, 30.29512379999997], [-9.16512, 30.304169799999997], [-9.1678928, 30.31293749999999], [-9.1726105, 30.321013100000016], [-9.1774071, 30.3290705], [-9.1822778, 30.337093800000005], [-9.1861173, 30.34278479999999], [-9.186181, 30.343131600000007], [-9.1880248, 30.346129000000005], [-9.1946288, 30.353203500000006], [-9.2021985, 30.359504099999995], [-9.2097015, 30.365893600000007], [-9.211468, 30.372372800000008], [-9.213188, 30.3790228], [-9.2149253, 30.383677000000006], [-9.216455, 30.388339099999996], [-9.217774, 30.392078499999997], [-9.2177805, 30.392090000000024], [-9.2184956, 30.394090000000006], [-9.2205495, 30.399642999999998], [-9.2218605, 30.403044600000015], [-9.223258, 30.406968500000005], [-9.2268543, 30.41043260000002], [-9.2346313, 30.415605799999994], [-9.2411755, 30.42074360000001], [-9.2472023, 30.428171300000002], [-9.2509965, 30.434025500000004], [-9.2510523, 30.434568100000007], [-9.253547, 30.443306799999988], [-9.2545275, 30.449696799999998], [-9.2520168, 30.458507600000004], [-9.2527191, 30.4676228], [-9.2588215, 30.475121000000016], [-9.2640285, 30.4830338], [-9.2630021, 30.487064100000012], [-9.2629385, 30.487254000000007], [-9.2630278, 30.48734350000001], [-9.271538, 30.48494380000001], [-9.2800973, 30.486437800000004], [-9.2905468, 30.48807960000002], [-9.3007861, 30.48559349999998], [-9.3098093, 30.480924499999986], [-9.3117983, 30.480356], [-9.3216303, 30.483664599999997], [-9.3318361, 30.48626250000001], [-9.3407146, 30.484219299999992], [-9.3461673, 30.483724499999994], [-9.3511466, 30.484945299999993], [-9.3512615, 30.485060999999988], [-9.3492091, 30.48848199999999], [-9.3454811, 30.494595000000004], [-9.3477125, 30.496713599999993], [-9.3477125, 30.496713599999993], [-9.3520841, 30.4998913], [-9.3520791, 30.499892300000013], [-9.3521673, 30.4999756], [-9.3520293, 30.500296600000013]
    ],
    [
        [-9.352228, 30.50011449999998], [-9.3522613, 30.500084099999995], [-9.3522613, 30.500084099999995], [-9.3522613, 30.500084099999995], [-9.3523099, 30.500039799999982], [-9.3523215, 30.499974100000003], [-9.351416, 30.499647800000005], [-9.3510763, 30.499351500000003], [-9.3510763, 30.499351500000003], [-9.346271, 30.495466300000018], [-9.345456, 30.49470610000003], [-9.3462608, 30.493204799999987], [-9.3511593, 30.4851575], [-9.3510175, 30.484947800000015], [-9.3464805, 30.483991500000016], [-9.3462058, 30.4838893], [-9.3431578, 30.483638799999966], [-9.342797, 30.483844300000015], [-9.3426105, 30.483979500000018], [-9.342261, 30.483818799999995], [-9.341192, 30.484057300000018], [-9.3309863, 30.486411100000026], [-9.3225643, 30.484032100000036], [-9.3128186, 30.480543299999994], [-9.3038348, 30.484874800000014], [-9.29369, 30.48735530000002], [-9.283099, 30.48733], [-9.2731115, 30.484641999999994], [-9.2631298, 30.4873391], [-9.262993, 30.487269800000007], [-9.2641575, 30.4842723], [-9.2627583, 30.48059649999999], [-9.2563275, 30.473331800000025], [-9.2525081, 30.465707299999977], [-9.2522966, 30.456589100000002], [-9.2545505, 30.447624799999986], [-9.2519155, 30.4388], [-9.2506255, 30.433823299999972], [-9.2462386, 30.426793000000018], [-9.2397226, 30.419646599999993], [-9.2342041, 30.415379799999997], [-9.2257481, 30.40954709999997], [-9.2227396, 30.405397800000017], [-9.221327, 30.4014971], [-9.2195998, 30.39711249999999], [-9.2176528, 30.392060999999998], [-9.2168708, 30.389428600000016], [-9.2157531, 30.386323800000028], [-9.2143818, 30.382457099999982], [-9.2127886, 30.37794980000001], [-9.2111985, 30.3713386], [-9.206578, 30.363179499999973], [-9.1990698, 30.356924300000017], [-9.1915595, 30.3506785], [-9.185745, 30.343201499999992], [-9.1856773, 30.342886599999986], [-9.1817606, 30.336202299999982], [-9.1767918, 30.32814599999999], [-9.1719998, 30.320098299999998], [-9.1673226, 30.312034799999992], [-9.1649211, 30.3031311], [-9.163194, 30.294159800000017], [-9.1614431, 30.285218099999994], [-9.1567405, 30.28085610000001], [-9.1535048, 30.278453499999998], [-9.1455955, 30.272481099999993], [-9.1376938, 30.266496799999985], [-9.1283318, 30.262379600000003], [-9.1198543, 30.256891600000003], [-9.1123565, 30.251122499999994], [-9.1122838, 30.251011800000015], [-9.1147763, 30.249376499999997], [-9.1177951, 30.24513129999997], [-9.1220815, 30.23690099999999], [-9.1282771, 30.23210029999997], [-9.1337775, 30.227238799999967], [-9.1339643, 30.227086299999996], [-9.1341835, 30.227104299999993], [-9.1342858, 30.22739779999999], [-9.136346, 30.229946800000008], [-9.1388576, 30.23033930000001], [-9.1492356, 30.231330600000007], [-9.1597756, 30.230794499999988], [-9.1597756, 30.230794499999988], [-9.163619, 30.224597799999984], [-9.1636401, 30.224208100000013], [-9.1609496, 30.222828300000003], [-9.1589458, 30.22212860000002], [-9.1587443, 30.221931000000012], [-9.1577638, 30.221558499999986], [-9.1577388, 30.221554799999993], [-9.1577388, 30.221554799999993], [-9.1575193, 30.221479000000002], [-9.1573378, 30.221316000000016], [-9.1563625, 30.220659499999996], [-9.1561595, 30.220623000000003], [-9.1557388, 30.221077100000016], [-9.155592, 30.221130000000002], [-9.1551288, 30.220960000000005], [-9.1548488, 30.220861100000022], [-9.1537998, 30.222423600000013], [-9.1536716, 30.222482099999993], [-9.1490453, 30.22042429999999], [-9.1486423, 30.22020399999998], [-9.148572, 30.2200543], [-9.149829, 30.2178275], [-9.1499314, 30.217716300000035], [-9.1500716, 30.217736799999997], [-9.1502183, 30.217776999999998], [-9.1503615, 30.217646000000002], [-9.1503615, 30.217646000000002]
    ],
];

var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


const mapToArray = (arr = []) => {
    const res = [];
    arr.forEach(function (obj, index) {
        const lat = Object.keys(obj)[0];
        const lon = Object.keys(obj)[1];
        res.push([obj[lat], obj[lon]]);
    });
    return res;
};

function finalData(result) {
    var startedInStationD = false
    var endedInStationT = false
    var linestring = tracklines[1];
    var data = [];
    var date;
    var i = 0;
    var arrivalTimestamp;
    console.log("finaldata, result lenght: " + result.length)
    while (i < result.length) {
        while (i < result.length && pointInStation([result[i].longitude, result[i].latitude], stationD)) {
            date = new Date(result[i].timestamp * 1000)
            weekDay = date.getDay();
            arrivalTimestamp = getArrivalTimestamp(result, i, stationT);
            data.push({
                'currentLat': result[i].latitude,
                'currentLon': result[i].longitude,
                'destinationLat': stationT[1],
                'destinationLon': stationT[0],
                'speedKPH': result[i].speedKPH,
                'weekDay': weekDay,
                'currentTimestamp': result[i].timestamp,
                'arrivalTimestamp': arrivalTimestamp,
            });

            console.log("data number :" + i + " is in stationD");
            startedInStationD = true;
            i++;
        }
        while (i < result.length && pointInTrack([result[i].longitude, result[i].latitude], linestring) && startedInStationD && !pointInStation([result[i].longitude, result[i].latitude], stationD) && !pointInStation([result[i].longitude, result[i].latitude], stationT)) {
            date = new Date(result[i].timestamp * 1000)
            weekDay = date.getDay();
            arrivalTimestamp = getArrivalTimestamp(result, i, stationT);
            data.push({
                'currentLat': result[i].latitude,
                'currentLon': result[i].longitude,
                'destinationLat': stationT[1],
                'destinationLon': stationT[0],
                'speedKPH': result[i].speedKPH,
                'weekDay': weekDay,
                'currentTimestamp': result[i].timestamp,
                'arrivalTimestamp': arrivalTimestamp,
            });

            console.log("data number :" + i + " is in track alers");
            i++;
        }
        while (i < result.length && pointInStation([result[i].longitude, result[i].latitude], stationT)) {
            date = new Date(result[i].timestamp * 1000)
            weekDay = date.getDay();
            arrivalTimestamp = getArrivalTimestamp(result, i, stationT);
            data.push({
                'currentLat': result[i].latitude,
                'currentLon': result[i].longitude,
                'destinationLat': stationD[1],
                'destinationLon': stationD[0],
                'speedKPH': result[i].speedKPH,
                'weekDay': weekDay,
                'currentTimestamp': result[i].timestamp,
                'arrivalTimestamp': arrivalTimestamp,
            });

            console.log("data number :" + i + " is in stationT");
            endedInStationT = true;
            i++;
        }
        while (i < result.length - 10 && pointInTrack([result[i].longitude, result[i].latitude], linestring) && endedInStationT && !pointInStation([result[i].longitude, result[i].latitude], stationD) && !pointInStation([result[i].longitude, result[i].latitude], stationT)) {
            date = new Date(result[i].timestamp * 1000)
            weekDay = date.getDay();
            arrivalTimestamp = getArrivalTimestamp(result, i, stationT);
            data.push({
                'currentLat': result[i].latitude,
                'currentLon': result[i].longitude,
                'destinationLat': stationD[1],
                'destinationLon': stationD[0],
                'speedKPH': result[i].speedKPH,
                'weekDay': weekDay,
                'currentTimestamp': result[i].timestamp,
                'arrivalTimestamp': arrivalTimestamp,
            });

            console.log("data number :" + i + " is in track retour");
            i++;
        }

        startedInStationD = false
        endedInStationT = false
        i++
    }
    return data;
}
function dataFilteringModel3(data) {
    var filteredData = [];
    var linestring = tracklines[1];
    var i = 0;
    var loops = 0;
    var startedInStationD = false;
    var endedInStationT = false;
    while (i < data.length) {
        while (pointInStation(data[i], stationD)) {
            filteredData.push(data[i]);
            console.log(data[i] + " is in stationD");
            startedInStationD = true;
            i++;
        }
        while (pointInTrack(data[i], linestring) && startedInStationD && !pointInStation(data[i], stationD) && !pointInStation(data[i], stationT)) {
            filteredData.push(data[i]);
            console.log(data[i] + " is in track aller");
            i++;
        }
        while (pointInStation(data[i], stationT)) {
            filteredData.push(data[i]);
            console.log(data[i] + " is in stationT");
            endedInStationT = true;
            i++;
        }
        while (pointInTrack(data[i], linestring) && endedInStationT && !pointInStation(data[i], stationD) && !pointInStation(data[i], stationT)) {
            filteredData.push(data[i]);
            console.log(data[i] + " is in track retour");
            i++;
        }
        startedInStationD = false
        endedInStationT = false
        i++
    }
    return filteredData;
}

function dataFiltringModel2(data) {
    console.log("start to filtring data")
    var filteredData = [];
    var linestring = tracklines[1];
    var i = 0;
    var startedInStationD = false;
    var endedInStationT = false;
    while (i < data.length) {

        while (pointInStation(data[i], stationD)) {
            filteredData.push(data[i]);
            console.log(data[i] + " is in stationD");
            i++;
            startedInStationD = true;
        }

        while (pointInTrack(data[i], linestring)) {
            filteredData.push(data[i]);
            console.log(i + "  " + data[i] + " in track aller");
            i++;
        }

        while (pointInStation(data[i], stationT)) {
            filteredData.push(data[i]);
            console.log(data[i] + " is in stationT");
            i++;
            endedInStationT = true;
        }

        while (pointInTrack(data[i], linestring) && endedInStationT) {
            filteredData.push(data[i]);
            console.log(i + "  " + data[i] + " in track retour");
            i++;
        }


        startedInStationD = false
        endedInStationT = false

        i++;
        console.log(i);
    }
    return filteredData;
}

function dataFiltringModel1(data) {
    var filteredData = [];
    var linestring = tracklines[0];
    var i = 0;
    while (i < data.length) {
        if (pointInStation(data[i], stationD) || pointInStation(data[i], stationT)) {
            filteredData.push(data[i]);
            console.log("data number " + i + " : " + data[i]);
            i++;

        }
        else {
            i++;
            if (pointInTrack(data[i], linestring)) {
                filteredData.push(data[i]);
                console.log("data number " + i + " : " + data[i]);
                i++;
            } else {
                i++;
            }
        }
    }
    return filteredData;
}


function pointInStation(point, station, width = 0.5) {
    try {
        if (calculateDistance(point[0], point[1], station[0], station[1]) < width)
            return true;
    } catch (e) {
        return false;
    }

    return false;
}

function pointInTrack(point, linestring, width = 0.2) {
    try {
        var line = turf.lineString(linestring);
        var pt = turf.point(point);
        if (turf.pointToLineDistance(pt, line, { units: 'kilometers' }) < width)
            return true;
    } catch (e) {
        return false;
    }

    return false;
}

function getArrivalTimestamp(result, i, stationDestination) {
    while (i < result.length - 1 && !pointInStation([result[i].longitude, result[i].latitude], stationDestination)) {
        i++;
    }
    return result[i].timestamp;

}

function pointNotInStations(point, raduis) {
    return !(pointInStation(point, stationsInLine1[0], raduis) || pointInStation(point, stationsInLine1[1], raduis) || pointInStation(point, stationsInLine1[2], raduis) || pointInStation(point, stationsInLine1[3], raduis));
}

function filterData(result) {
    var data = [];
    var dataInAller = [];
    var dataInRetour = [];
    var addDataAller = false;
    var addDataRetour = false;
    var debug = [];
    const linestring = tracklines[1];
    var i = 0;
    //make sure that the vehicule starts from the depart station
    while (i < result.length && !pointInStation([result[i].longitude, result[i].latitude], stationsInLine1[0], 0.5))
        i++;

    while (i < result.length) {
        for (var j = 0; j < stationsInLine1.length - 1; j++) {
            while (i < result.length && pointInStation([result[i].longitude, result[i].latitude], stationsInLine1[j], 0.5)) {
                date = new Date(result[i].timestamp * 1000)
                currentHour = date.getHours()
                currentMinute = date.getMinutes()
                weekDay = date.getDay();
                debug.push({ 'dataID': i, 'status': `in station ${j}` });
                for (var t = j + 1; t < stationsInLine1.length; t++) {
                    arrivalTimestamp = getArrivalTimestamp(result, i, stationsInLine1[t]);
                    arrivalDate = new Date(arrivalTimestamp * 1000);
                    timeDelta = (arrivalDate.getTime() - date.getTime()) / 60000;
                    dataInAller.push({
                        'deviceID': result[i].deviceID,
                        'currentLat': result[i].latitude,
                        'currentLon': result[i].longitude,
                        'destinationStation': t,
                        'speedKPH': result[i].speedKPH,
                        'weekDay': weekDay,
                        'currentHour': currentHour,
                        'currentMinute': currentMinute,
                        'timeDelta': timeDelta,
                        'status': `in station ${j}`,
                        'currentTimestamp': result[i].timestamp,
                        'arrivalTimestamp': arrivalTimestamp,
                    });
                }
                if (j == stationsInLine1.length - 2) addDataAller = true;
                // console.log("data number :" + i + " is in station " + j);
                i++;
            }
            while (i < result.length && pointInTrack([result[i].longitude, result[i].latitude], linestring, 0.3) && pointNotInStations([result[i].longitude, result[i].latitude], 0.5)) {
                date = new Date(result[i].timestamp * 1000)
                currentHour = date.getHours()
                currentMinute = date.getMinutes()
                weekDay = date.getDay();
                debug.push({ 'dataID': i, 'status': `in track aller`, });
                for (var t = j + 1; t < stationsInLine1.length; t++) {
                    arrivalTimestamp = getArrivalTimestamp(result, i, stationsInLine1[t]);
                    arrivalDate = new Date(arrivalTimestamp * 1000);
                    timeDelta = (arrivalDate.getTime() - date.getTime()) / 60000;
                    dataInAller.push({
                        'deviceID': result[i].deviceID,
                        'currentLat': result[i].latitude,
                        'currentLon': result[i].longitude,
                        'destinationStation': t,
                        'speedKPH': result[i].speedKPH,
                        'weekDay': weekDay,
                        'currentHour': currentHour,
                        'currentMinute': currentMinute,
                        'timeDelta': timeDelta,
                        'status': `in traget aller`,
                        'currentTimestamp': result[i].timestamp,
                        'arrivalTimestamp': arrivalTimestamp,
                    });
                }
                // console.log("data number :" + i + " is in track aller");
                i++;
            }
        }
        console.log("data in aller: " + dataInAller.length)

        if (addDataAller) data = data.concat(dataInAller);
        dataInAller = [];
        for (var j = stationsInLine1.length - 1; j > 0; j--) {
            while (i < result.length && pointInStation([result[i].longitude, result[i].latitude], stationsInLine1[j], 0.5)) {
                date = new Date(result[i].timestamp * 1000)
                currentHour = date.getHours()
                currentMinute = date.getMinutes()
                weekDay = date.getDay();
                debug.push({ 'dataID': i, 'status': `in station ${j}` });
                for (var t = j - 1; t >= 0; t--) {
                    arrivalTimestamp = getArrivalTimestamp(result, i, stationsInLine1[t]);
                    arrivalDate = new Date(arrivalTimestamp * 1000);
                    timeDelta = (arrivalDate.getTime() - date.getTime()) / 60000;
                    dataInRetour.push({
                        'deviceID': result[i].deviceID,
                        'currentLat': result[i].latitude,
                        'currentLon': result[i].longitude,
                        'destinationStation': t,
                        'speedKPH': result[i].speedKPH,
                        'weekDay': weekDay,
                        'currentHour': currentHour,
                        'currentMinute': currentMinute,
                        'timeDelta': timeDelta,
                        'status': `in station ${j}`,
                        'currentTimestamp': result[i].timestamp,
                        'arrivalTimestamp': arrivalTimestamp,
                    });
                }
                // console.log("data number :" + i + " is in station " + j);
                if (j == 1) addDataRetour = true;
                i++;
            }
            while (i < result.length && pointInTrack([result[i].longitude, result[i].latitude], linestring, 0.3) && pointNotInStations([result[i].longitude, result[i].latitude], 0.5)) {
                date = new Date(result[i].timestamp * 1000)
                currentHour = date.getHours()
                currentMinute = date.getMinutes()
                weekDay = date.getDay();
                debug.push({ 'dataID': i, 'status': `in track retour` });
                for (var t = j - 1; t >= 0; t--) {
                    arrivalTimestamp = getArrivalTimestamp(result, i, stationsInLine1[t]);
                    arrivalDate = new Date(arrivalTimestamp * 1000);
                    timeDelta = (arrivalDate.getTime() - date.getTime()) / 60000;
                    dataInRetour.push({
                        'deviceID': result[i].deviceID,
                        'currentLat': result[i].latitude,
                        'currentLon': result[i].longitude,
                        'destinationStation': t,
                        'speedKPH': result[i].speedKPH,
                        'weekDay': weekDay,
                        'currentHour': currentHour,
                        'currentMinute': currentMinute,
                        'timeDelta': timeDelta,
                        'status': `in trajet retour`,
                        'currentTimestamp': result[i].timestamp,
                        'arrivalTimestamp': arrivalTimestamp,
                    });
                }
                // console.log("data number :" + i + " is in track retour");
                i++;
            }
        }
        console.log("data in retour: " + dataInRetour.length)
        if (addDataRetour) data = data.concat(dataInRetour);
        dataInRetour = []
        i++;
        addDataAller = false;
        addDataRetour = false;
    }
    console.log("in filterdata lenght " + data.length)
    return data;
}





//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}



app.get("/map/:deviceID", (req, res) => {
    res.render("map", {
        deviceID: req.params.deviceID
    })
})

function getFilteredData(deviceID, limit, callback) {
    var data;
    const query = "select deviceID, longitude, latitude, timestamp, speedKPH from  EventData  where speedKPH > 0 and deviceID = '" + deviceID + "' ORDER BY timestamp ASC limit " + limit;
    pool.query(query, (error, result) => {
        if (error)
            res.send(error)
        else {
            data = filterData(result)
            console.log("in getFilteredData lenght: " + data.length)
        }
        return callback(data);
    })

}

const devicesInLine = [
    { "deviceID": "356173062839811" }, { "deviceID": "356173062945105" },
    { "deviceID": "356173062967646" }, { "deviceID": "356173062968453" },
    { "deviceID": "356307048562507" }, { "deviceID": "356307048781545" },
    { "deviceID": "356307048781669" }, { "deviceID": "356307048781735" },
    { "deviceID": "356307048855877" }, { "deviceID": "864547032442175" },
    { "deviceID": "864547034896741" }, { "deviceID": "864547036136047" },
    { "deviceID": "864547036311749" }, { "deviceID": "866191037938685" },
    { "deviceID": "867481035404890" }, { "deviceID": "869867032331003" },
    { "deviceID": "356307048781800" }, { "deviceID": "869867036844613" }
];

app.get("/insertData/:deviceID", (req, res) => {
    getFilteredData(req.params.deviceID, 1000000, (data) => {
        console.log("test lenght " + data.length)
        var insertQuery = "";
        var values = "";
        for (var j = 0; j < data.length; j++) {
            if (j != data.length - 1)
                values += "(" + data[j].deviceID + ", " + data[j].currentLat + ", " + data[j].currentLon + ", " + data[j].destinationStation + ", " + data[j].speedKPH + ", " + data[j].weekDay +  ", " + data[j].currentHour + ", " + data[j].currentMinute + ", " +  data[j].currentTimestamp +  ", " + data[j].arrivalTimestamp + ", " + data[j].timeDelta + ", '" + data[j].status + "'),";
            else
                values += "(" + data[j].deviceID + ", " + data[j].currentLat + ", " + data[j].currentLon + ", " + data[j].destinationStation + ", " + data[j].speedKPH + ", " +  data[j].weekDay  + ", " + data[j].currentHour + ", " + data[j].currentMinute + ", " +  data[j].currentTimestamp  + ", " + data[j].arrivalTimestamp + ", " + data[j].timeDelta + ", '" + data[j].status + "');";

        }
        insertQuery = "INSERT INTO final_data (deviceID, currentLat, currentLon, destinationStation, speedKPH, weekDay, currentHour, currentMinute, currentTimestamp, arrivalTimestamp, timeDelta, status) VALUES ";
        insertQuery += values;
        conn.query(insertQuery, (error2, result2) => {
            if (error2) {
                console.log("error")
                res.send(error2)
            }
            else {
                console.log(" is inserted")
                res.send(result2)
            }
        });
    });
});


app.get("/getFilteredDataByDeviceAPI/:device/:limit/:maxTimeDelta", (req, res) => {
    conn.query("select currentLat,currentLon,destinationStation,speedKPH,weekDay,currentHour,currentMinute,timeDelta,status from final_data where deviceID = " + req.params.device + "  and timeDelta <= " + req.params.maxTimeDelta + " ORDER BY currentTimestamp ASC limit " + req.params.limit, (error, result) => {
        if (error)
            res.send(error)
        else {
            console.log(result.length);
            res.send(result);
        }
    });
});


app.get("/getFilteredDataByDevice/:device/:limit", (req, res) => {
    conn.query("select DISTINCT currentLat, currentLon from final_data where deviceID = " + req.params.device + " and speedKPH > 0  ORDER BY currentTimestamp ASC limit " + req.params.limit, (error, result) => {
        if (error)
            res.send(error)
        else {
            console.log(result.length);
            res.send(result);
        }
    });
});

app.get("/getRawDataByDevice/:device/:limit", (req, res) => {
    pool.query("select latitude, longitude from EventData where deviceID = " + req.params.device + " and speedKPH > 0 ORDER BY timestamp ASC limit " + req.params.limit, (error, result) => {
        if (error)
            res.send(error)
        else {
            console.log(result.length);
            res.send(result);
        }
    });
});



app.listen(3000);  