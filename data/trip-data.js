/*
 * 行程数据文件
 * ============
 * 后续更新行程时，通常只需要修改这个文件，无需改动 index.html / app.js / styles.css。
 *
 * 字段说明：
 * - days[].date        日期，格式 YYYY-MM-DD。
 * - days[].dayLabel    当天标题。
 * - days[].title       一句话概括当天主题。
 * - days[].hotel       当晚住宿名称；没有则填 null。
 * - days[].hotelAddress 住宿地址（用于地图标注与说明）。
 * - days[].stops       当天按时间排序的行程点。
 * - stops[].time       时间，HH:mm。
 * - stops[].timezone   时区偏移，韩国用 "+09:00"，香港用 "+08:00"。
 * - stops[].title      地点/事项名称，点击后跳转 Naver Maps。
 * - stops[].mapQuery   更精确的 Naver Maps 搜索词。
 * - stops[].note       简要说明。
 * - stops[].category   用于配色：flight/train/bus/metro/hotel/meal/activity/appointment。
 */

window.TRIP_DATA = {
  meta: {
    title: "韩国之旅",
    subtitle: "釜山 & 首尔 · 2026.09.26 — 2026.10.03",
    clinicAddressPending: true,
    clinicNote: "城南医美诊所具体地址待补充；网页中的 10 月 2 日交通先按“板桥/亭子一带”通用路线标注。"
  },

  // 每日市内动线地图：cityPoints 提供各站点的经纬度，dayRoutes 按时间顺序连线。
  map: {
    cityPoints: {
      busan: {
        "busan-station": { name: "釜山站", x: 120, y: 500, lat: 35.1152, lng: 129.0413 },
        "ramada": { name: "温德姆安可酒店", x: 210, y: 440, lat: 35.1160, lng: 129.0392 },
        "busanok": { name: "부산옥 釜山玉", x: 90, y: 545, lat: 35.1152, lng: 129.0413 },
        "ijo-seolleongtang": { name: "이조설렁탕", x: 55, y: 525, lat: 35.1157, lng: 129.0401 },
        "toseong": { name: "土城站", x: 280, y: 385, lat: 35.1005, lng: 129.0187 },
        "gamcheon": { name: "甘川文化村", x: 335, y: 290, lat: 35.0974, lng: 129.0103 },
        "jagalchi": { name: "札嘎其·新庆北商会", x: 340, y: 420, lat: 35.0966, lng: 129.0300 },
        "biff": { name: "BIFF广场/龙头山", x: 405, y: 465, lat: 35.0993, lng: 129.0280 },
        "nampo-seolleongtang": { name: "南浦雪浓汤", x: 430, y: 525, lat: 35.0990, lng: 129.0270 },
        "seomyeon": { name: "西面站", x: 500, y: 420, lat: 35.1570, lng: 129.0590 },
        "haeundae": { name: "海云台站", x: 705, y: 155, lat: 35.1645, lng: 129.1607 },
        "haedong": { name: "海东龙宫寺", x: 865, y: 55, lat: 35.1880, lng: 129.2230 },
        "ilpum-hanwoo": { name: "一品韩牛", x: 780, y: 240, lat: 35.1640, lng: 129.1650 },
        "haeundae-beach": { name: "海云台海水浴场", x: 760, y: 105, lat: 35.1587, lng: 129.1604 },
        "cheongsapo-photo": { name: "青沙浦胶囊拍照点", x: 825, y: 115, lat: 35.1715, lng: 129.1890 },
        "geumsu-bokguk": { name: "锦水福汤本店", x: 800, y: 285, lat: 35.1600, lng: 129.1640 },
        "spaland": { name: "SPALAND 汗蒸", x: 660, y: 190, lat: 35.1688, lng: 129.1300 }
      },
      seoul: {
        "seoul-station": { name: "首尔站", x: 105, y: 490, lat: 37.5547, lng: 126.9707 },
        "bonjuk-seoul": { name: "本粥首尔站店", x: 165, y: 540, lat: 37.5550, lng: 126.9710 },
        "ibis": { name: "宜必思明洞大使酒店", x: 330, y: 510, lat: 37.5610, lng: 126.9783 },
        "seowonjuk": { name: "书院粥店", x: 345, y: 560, lat: 37.5625, lng: 126.9850 },
        "deoksugung": { name: "德寿宫/贞洞", x: 205, y: 420, lat: 37.5658, lng: 126.9746 },
        "kimchi": { name: "明洞泡菜体验", x: 385, y: 540, lat: 37.5630, lng: 126.9840 },
        "cheonggyecheon": { name: "清溪川", x: 415, y: 460, lat: 37.5702, lng: 126.9787 },
        "odarijip": { name: "오다리집 간장게장（酱蟹）", x: 355, y: 550, lat: 37.5612, lng: 126.9860 },
        "anguk": { name: "安国站", x: 440, y: 355, lat: 37.5765, lng: 126.9855 },
        "bukchon": { name: "北村/三清洞", x: 465, y: 270, lat: 37.5810, lng: 126.9840 },
        "tosokchon": { name: "土俗村参鸡汤", x: 345, y: 245, lat: 37.5780, lng: 126.9730 },
        "changdeokgung": { name: "昌德宫", x: 545, y: 315, lat: 37.5795, lng: 126.9910 },
        "insadong": { name: "仁寺洞", x: 500, y: 400, lat: 37.5745, lng: 126.9850 },
        "sunhuine": { name: "顺熙家绿豆煎饼", x: 590, y: 435, lat: 37.5700, lng: 126.9990 },
        "gyeongbokgung": { name: "景福宫", x: 320, y: 170, lat: 37.5786, lng: 126.9770 },
        "goryeo-samgyetang": { name: "高丽参鸡汤", x: 260, y: 265, lat: 37.5800, lng: 126.9740 },
        "melody-photo": { name: "首尔旋律旅拍（자하문로 19）", x: 400, y: 155, lat: 37.5780, lng: 126.9735 },
        "taecho-galbi": { name: "太初排骨明洞店", x: 385, y: 480, lat: 37.5625, lng: 126.9840 },
        "clinic": { name: "城南医美诊所", x: 760, y: 520, lat: 37.3940, lng: 127.1100 },
        "bonjuk-jeongja": { name: "本粥盆塘亭子店", x: 700, y: 575, lat: 37.3660, lng: 127.1060 },
        "bundang-park": { name: "盆塘中央公园", x: 810, y: 440, lat: 37.3760, lng: 127.1000 },
        "bonjuk-myeongdong": { name: "本粥明洞店", x: 390, y: 570, lat: 37.5625, lng: 126.9850 },
        "airport-bus": { name: "明洞机场大巴站", x: 285, y: 570, lat: 37.5630, lng: 126.9830 },
        "incheon": { name: "仁川国际机场", x: 45, y: 80, lat: 37.4602, lng: 126.4407 }
      }
    },

    // 每一天的市内动线：city 选择城市，points 按时间顺序连接。
    dayRoutes: [
      {
        day: 1,
        city: "busan",
        points: ["busan-station", "ramada", "busanok"]
      },
      {
        day: 2,
        city: "busan",
        points: [
          "ramada",
          "busan-station",
          "toseong",
          "gamcheon",
          "jagalchi",
          "biff",
          "nampo-seolleongtang",
          "ramada"
        ]
      },
      {
        day: 3,
        city: "busan",
        points: [
          "ramada",
          "busan-station",
          "seomyeon",
          "haeundae",
          "haedong",
          "ilpum-hanwoo",
          "haeundae-beach",
          "cheongsapo-photo",
          "geumsu-bokguk",
          "spaland",
          "ramada"
        ]
      },
      {
        day: 4,
        city: "seoul",
        points: [
          "seoul-station",
          "bonjuk-seoul",
          "ibis",
          "deoksugung",
          "kimchi",
          "cheonggyecheon",
          "odarijip"
        ]
      },
      {
        day: 5,
        city: "seoul",
        points: [
          "ibis",
          "anguk",
          "bukchon",
          "tosokchon",
          "changdeokgung",
          "insadong",
          "sunhuine"
        ]
      },
      {
        day: 6,
        city: "seoul",
        points: [
          "ibis",
          "gyeongbokgung",
          "goryeo-samgyetang",
          "melody-photo",
          "gyeongbokgung",
          "bukchon",
          "taecho-galbi"
        ]
      },
      {
        day: 7,
        city: "seoul",
        points: [
          "ibis",
          "clinic",
          "bonjuk-jeongja",
          "bundang-park",
          "bonjuk-myeongdong",
          "ibis"
        ]
      },
      {
        day: 8,
        city: "seoul",
        points: ["ibis", "airport-bus", "incheon"]
      }
    ]
  },

  days: [
    {
      date: "2026-09-26",
      dayLabel: "第1天 · 9月26日（周六）",
      title: "香港 → 首尔 → 釜山",
      hotel: "釜山站温德姆华美达安可酒店",
      hotelAddress: "부산 동구 중앙대로196번길 10（Dong-gu, Busan）",
      startCity: "香港",
      endCity: "釜山",
      stops: [
        { time: "07:55", timezone: "+08:00", title: "香港国际机场", mapQuery: "香港国际机场", note: "CX434 出发，飞往首尔仁川机场。", category: "flight" },
        { time: "12:40", timezone: "+09:00", title: "仁川国际机场", mapQuery: "인천국제공항", note: "入境、取行李；购买并充值 T-money，取少量韩元现金。", category: "flight" },
        { time: "14:00", timezone: "+09:00", title: "AREX 机场快线", mapQuery: "인천공항철도 서울역", note: "仁川机场 T1 → 首尔站，普通车约 61 分钟、₩4,750；时间紧可乘快线 ₩9,500。", category: "train" },
        { time: "15:45", timezone: "+09:00", title: "首尔站 KTX", mapQuery: "서울역", note: "建议订 KTX #181（15:45）或 #193（15:50），约 18:03–18:20 到釜山。", category: "train" },
        { time: "18:03", timezone: "+09:00", title: "釜山站", mapQuery: "부산역", note: "抵达釜山，步行约 5–8 分钟到酒店。", category: "train" },
        { time: "18:15", timezone: "+09:00", title: "入住釜山站温德姆华美达安可酒店", mapQuery: "라마다 앙코르 바이 윈덤 부산역", note: "办理入住，稍作休息。", category: "hotel" },
        { time: "19:00", timezone: "+09:00", title: "晚餐：부산옥（釜山玉·牛肉汤饭）", mapQuery: "부산옥 부산역", note: "牛肉汤饭/牛骨汤，无猪肉；釜山站内或附近。", category: "meal" }
      ]
    },
    {
      date: "2026-09-27",
      dayLabel: "第2天 · 9月27日（周日）",
      title: "甘川文化村 + 札嘎其 + 釜山老城区",
      hotel: "釜山站温德姆华美达安可酒店",
      hotelAddress: "부산 동구 중앙대로196번길 10（Dong-gu, Busan）",
      startCity: "釜山",
      endCity: "釜山",
      map: { local: "busan", label: "釜山市区活动" },
      stops: [
        { time: "09:00", timezone: "+09:00", title: "釜山站 → 土城站", mapQuery: "부산역", note: "地铁1号线，釜山站到土城站共4站，约10分钟，₩1,600。", category: "metro" },
        { time: "09:20", timezone: "+09:00", title: "土城站 → 甘川文化村", mapQuery: "토성역", note: "6号出口转西区2 / 2-2 / 沙下1-1路小巴，约10分钟，₩1,550；也可打车约 ₩5,000。", category: "bus" },
        { time: "09:30", timezone: "+09:00", title: "甘川文化村", mapQuery: "감천문화마을", note: "彩色山城、壁画阶梯，免费进入，慢走约2小时。【拍照机位】小王子与沙漠狐狸雕像（어린왕자와 사막여우 동상），是全村最热门机位，可俯瞰彩色屋海，另有村顶展望台。【怎么去】进村后从游客中心沿主路往上走约10分钟即到小王子像，旺季需排队约20分钟。", category: "activity" },
        { time: "12:15", timezone: "+09:00", title: "午餐：신경북상회（新庆北商会·札嘎其海鲜）", mapQuery: "신경북상회 자갈치시장", note: "螃蟹/龙虾/生鱼片等海鲜，无猪肉。", category: "meal" },
        { time: "13:45", timezone: "+09:00", title: "BIFF广场 / 国际市场 / 龙头山公园", mapQuery: "BIFF광장", note: "步行逛老城区；可在 BIFF 广场吃瓜子糖饼。", category: "activity" },
        { time: "17:00", timezone: "+09:00", title: "晚餐：남포설렁탕（南浦雪浓汤）", mapQuery: "남포설렁탕", note: "24小时牛骨汤老店；点雪浓汤/牛排骨汤，勿点含猪肉的饺子。", category: "meal" },
        { time: "18:30", timezone: "+09:00", title: "返回釜山站酒店", mapQuery: "부산역", note: "札嘎其站搭1号线回釜山站，3站，₩1,600。", category: "metro" }
      ]
    },
    {
      date: "2026-09-28",
      dayLabel: "第3天 · 9月28日（周一）",
      title: "海东龙宫寺 + 海云台 + 青沙浦拍胶囊 + SPALAND 汗蒸",
      hotel: "釜山站温德姆华美达安可酒店",
      hotelAddress: "부산 동구 중앙대로196번길 10（Dong-gu, Busan）",
      startCity: "釜山",
      endCity: "釜山",
      map: { local: "busan", label: "釜山市区活动" },
      stops: [
        { time: "08:30", timezone: "+09:00", title: "釜山站 → 西面站 → 海云台站", mapQuery: "부산역", note: "1号线釜山站到西面站6站，换2号线到海云台站16站；全程地铁约 ₩1,800。", category: "metro" },
        { time: "09:15", timezone: "+09:00", title: "海云台站 → 海东龙宫寺", mapQuery: "해운대역", note: "7号出口转181/100/1001路公交，约25–30分钟，₩1,550。", category: "bus" },
        { time: "10:00", timezone: "+09:00", title: "海东龙宫寺", mapQuery: "해동용궁사", note: "韩国少见的临海寺院，免费，依山面海。【拍照机位】入口广场向下俯瞰「寺院+大海」的全景最佳；寺内極樂殿、龍門石橋与16罗汉像也出片。【怎么去】从公交站/停车场沿石阶一路下行即可到临海大殿。", category: "activity" },
        { time: "12:00", timezone: "+09:00", title: "午餐：일품한우（一品韩牛·海云台）", mapQuery: "일품한우 해운대", note: "梅实韩牛生排骨专门店，无猪肉。", category: "meal" },
        { time: "13:30", timezone: "+09:00", title: "海云台海水浴场 + 冬柏岛 / APEC世峰楼", mapQuery: "해운대해수욕장", note: "沿海步道平缓，适合慢慢散步拍照。", category: "activity" },
        { time: "15:00", timezone: "+09:00", title: "青沙浦拍天空胶囊（不乘车）", mapQuery: "청사포 다릿돌전망대", note: "没买到胶囊票也没关系：直接去青沙浦다릿돌전망대(玻璃栈道)，可俯瞰沿海胶囊轨道与红白灯塔，是拍胶囊的最佳机位。交通：海云台站打车约10分钟(约₩6,000-8,000)，或乘公交100/139路到청사포下车，步行约5分钟。", category: "activity" },
        { time: "17:30", timezone: "+09:00", title: "晚餐：금수복국 본점（锦水福汤本店·海云台）", mapQuery: "금수복국 본점", note: "河豚汤/海鲜，无猪肉；如不吃河豚可换海鲜锅。", category: "meal" },
        { time: "19:00", timezone: "+09:00", title: "SPALAND 汗蒸（新世界 Centum City）", mapQuery: "스파랜드 센텀시티", note: "韩国顶级汗蒸/温泉，多种主题汗蒸房与足浴；地铁2号线 Centum City（센텀시티）站12号出口约110米，新世界百货1层。营业至22:00（21:00最后入场），需出示证件，建议提前预约/购票。", category: "activity" },
        { time: "21:00", timezone: "+09:00", title: "返回釜山站酒店", mapQuery: "부산역", note: "从 Centum City 站搭2号线回西面站，换1号线到釜山站。", category: "metro" }
      ]
    },
    {
      date: "2026-09-29",
      dayLabel: "第4天 · 9月29日（周二）",
      title: "釜山 → 首尔，泡菜体验 + 德寿宫",
      hotel: "宜必思首尔明洞大使酒店",
      hotelAddress: "서울 중구 남대문로 78（Jung-gu, Seoul）",
      startCity: "釜山",
      endCity: "首尔",
      stops: [
        { time: "09:00", timezone: "+09:00", title: "退房前往釜山站", mapQuery: "부산역", note: "从酒店步行到釜山站。", category: "hotel" },
        { time: "10:28", timezone: "+09:00", title: "KTX026 釜山 → 首尔", mapQuery: "부산역", note: "10:28 发车，13:04 到首尔站；座位 12车5A/5B。", category: "train" },
        { time: "13:04", timezone: "+09:00", title: "抵达首尔站", mapQuery: "서울역", note: "KTX026 到达首尔站，出站后先在站内用餐。", category: "train" },
        { time: "13:20", timezone: "+09:00", title: "午餐：본죽&비빔밥 서울역점（本粥&拌饭 首尔站店）", mapQuery: "본죽 서울역점", note: "粥或拌饭，无猪肉；在首尔站内解决。", category: "meal" },
        { time: "14:15", timezone: "+09:00", title: "首尔站 → 明洞酒店", mapQuery: "서울역", note: "4号线首尔站到明洞站2站，₩1,550；行李多可打车约 ₩8,000–12,000。", category: "metro" },
        { time: "14:30", timezone: "+09:00", title: "入住宜必思首尔明洞大使酒店", mapQuery: "이비스 앰배서더 서울 명동", note: "办理入住，稍作休息。", category: "hotel" },
        { time: "15:30", timezone: "+09:00", title: "德寿宫石墙路 + 贞洞胡同", mapQuery: "덕수궁", note: "比首尔塔轻松的市内散步线；德寿宫门票 ₩1,000。【拍照机位】宫外돌담길(石墙路)与大漢门是经典机位，石墙+银杏树很出片。【怎么去】地铁1/2号线市厅(시청)站出站即到，石墙路沿宫墙外侧走一圈。", category: "activity" },
        { time: "16:30", timezone: "+09:00", title: "明洞泡菜制作体验", mapQuery: "명동 김치문화체험관", note: "约60–90分钟；建议提前通过 Klook / Trip.com 预约。", category: "activity" },
        { time: "18:30", timezone: "+09:00", title: "清溪川散步", mapQuery: "청계천", note: "傍晚沿清溪川散步，顺路回明洞。", category: "activity" },
        { time: "19:00", timezone: "+09:00", title: "晚餐：오다리집 간장게장（Odarijip·明洞酱蟹）", mapQuery: "오다리집 간장게장 명동", note: "明洞人气酱蟹(간장게장)专门店；生腌花蟹配米饭，无猪肉；对生食海鲜敏感者慎点。地铁4号线明洞站5号口步行约2分钟。", category: "meal" }
      ]
    },
    {
      date: "2026-09-30",
      dayLabel: "第5天 · 9月30日（周三）",
      title: "北村韩屋村 + 昌德宫 + 仁寺洞 + 广藏市场",
      hotel: "宜必思首尔明洞大使酒店",
      hotelAddress: "서울 중구 남대문로 78（Jung-gu, Seoul）",
      startCity: "首尔",
      endCity: "首尔",
      map: { local: "seoul", label: "首尔市区活动" },
      stops: [
        { time: "09:30", timezone: "+09:00", title: "明洞 → 安国站", mapQuery: "명동역", note: "4号线明洞到忠武路1站，换3号线到安国站2站；共3站，₩1,550。", category: "metro" },
        { time: "09:50", timezone: "+09:00", title: "北村韩屋村 + 三清洞", mapQuery: "북촌한옥마을", note: "传统韩屋、石墙巷与咖啡馆；免费，居民区请保持安静。【拍照机位】北村8景里最出片的是韩屋屋脊+远处景福宫/仁王山/青瓦台的俯瞰视角（5~8景一带），以及삼청동돌계단길。【怎么去】从북촌문화센터沿北村路上坡即可逐一打卡，路上有8景指示牌。", category: "activity" },
        { time: "11:15", timezone: "+09:00", title: "午餐：토속촌 삼계탕（土俗村参鸡汤）", mapQuery: "토속촌 삼계탕", note: "人参鸡汤，无猪肉；不接散客预约，建议 11:15 前到。", category: "meal" },
        { time: "13:00", timezone: "+09:00", title: "昌德宫（可选秘苑）", mapQuery: "창덕궁", note: "门票 ₩3,000；秘苑另加 ₩5,000 且需提前约6天预约。【拍照机位】秘苑芙蓉池(부용지)与亭子是必拍机位，仁政殿前广场也出片。【怎么去】安国站步行约5分钟到敦化门入宫，芙蓉池在秘苑内（需跟导览）。", category: "activity" },
        { time: "15:00", timezone: "+09:00", title: "仁寺洞", mapQuery: "인사동", note: "传统工艺品、画廊、韩纸与传统茶馆。", category: "activity" },
        { time: "16:30", timezone: "+09:00", title: "晚餐：순희네빈대떡（顺熙家绿豆煎饼·广藏市场）", mapQuery: "순희네빈대떡", note: "绿豆煎饼/拌饭；点餐时说明不要猪肉。【拍照机位】市场1层먹거리골목(小吃街)的彩棚与摊档最出片，拍完正好吃。【怎么去】地铁1号线钟路5街(종로5가)站下车即到，小吃街在市场主楼1层。", category: "meal" }
      ]
    },
    {
      date: "2026-10-01",
      dayLabel: "第6天 · 10月1日（周四）",
      title: "景福宫韩服旅拍",
      hotel: "宜必思首尔明洞大使酒店",
      hotelAddress: "서울 중구 남대문로 78（Jung-gu, Seoul）",
      startCity: "首尔",
      endCity: "首尔",
      map: { local: "seoul", label: "首尔市区活动" },
      stops: [
        { time: "10:00", timezone: "+09:00", title: "景福宫守门将换岗仪式", mapQuery: "경복궁", note: "换岗仪式约10:00/14:00，周四正常。", category: "activity" },
        { time: "12:00", timezone: "+09:00", title: "午餐：고려삼계탕 본점（高丽参鸡汤本店）", mapQuery: "고려삼계탕", note: "人参鸡汤，无猪肉；穿韩服前吃轻一点。", category: "meal" },
        { time: "13:00", timezone: "+09:00", title: "首尔旋律旅拍 · 双人韩服妆造", mapQuery: "서울시 종로구 자하문로 19", note: "英文地址：19 Jahamun-ro, Jongno-gu, Seoul；韩文地址：서울시 종로구 자하문로 19；地铁3号线景福宫站2号出口直行200米；打车地址：서울시 종로구 자하문로 19-1；请带 ₩350,000 现金。", category: "appointment" },
        { time: "14:30", timezone: "+09:00", title: "景福宫拍摄", mapQuery: "경복궁", note: "穿韩服可免费入宫；拍摄约1–2小时。", category: "appointment" },
        { time: "17:30", timezone: "+09:00", title: "三清洞 / 北村散步", mapQuery: "삼청동", note: "拍摄后若体力允许，可顺路散步；否则回明洞休息。", category: "activity" },
        { time: "19:00", timezone: "+09:00", title: "晚餐：태초갈비 명동점（太初排骨 明洞店·韩牛）", mapQuery: "태초갈비 명동점", note: "韩牛烤肉专门店，无猪肉。", category: "meal" }
      ]
    },
    {
      date: "2026-10-02",
      dayLabel: "第7天 · 10月2日（周五）",
      title: "城南市医美 + 盆塘轻活动",
      hotel: "宜必思首尔明洞大使酒店",
      hotelAddress: "서울 중구 남대문로 78（Jung-gu, Seoul）",
      startCity: "首尔",
      endCity: "城南市",
      stops: [
        { time: "09:30", timezone: "+09:00", title: "前往城南市医美诊所（地址待补）", mapQuery: "성남시", note: "若诊所在板桥/亭子一带：4号线明洞→忠武路换3号线→新沙站，换新盆唐线到板桥/亭子/书岘/美金等站；约55–75分钟。", category: "transport" },
        { time: "10:00", timezone: "+09:00", title: "城南市医美", mapQuery: "성남시", note: "提前15分钟到，带护照并按诊所术前说明执行。", category: "appointment" },
        { time: "12:00", timezone: "+09:00", title: "午餐：본죽 분당정자느티마을점（本粥 盆塘亭子店）", mapQuery: "본죽 분당정자느티마을점", note: "粥/软食，无猪肉；若诊所近书岘站，可改去 본죽 분당서현점。", category: "meal" },
        { time: "14:00", timezone: "+09:00", title: "盆塘中央公园 / 亭子洞咖啡馆街或休息", mapQuery: "분당중앙공원", note: "术后避免暴晒、饮酒、桑拿和剧烈运动；状态一般就直接回酒店休息。", category: "activity" },
        { time: "16:30", timezone: "+09:00", title: "返回明洞酒店", mapQuery: "명동역", note: "从盆塘/亭子搭新盆唐线回明洞，约55–70分钟；术后注意休息，避免劳累。", category: "metro" },
        { time: "19:00", timezone: "+09:00", title: "晚餐：본죽&비빔밥 명동점（本粥&拌饭 明洞店）", mapQuery: "본죽 명동점", note: "粥/拌饭，清淡无猪肉。", category: "meal" }
      ]
    },
    {
      date: "2026-10-03",
      dayLabel: "第8天 · 10月3日（周六）",
      title: "首尔 → 香港",
      hotel: null,
      hotelAddress: null,
      startCity: "首尔",
      endCity: "香港",
      stops: [
        { time: "09:00", timezone: "+09:00", title: "退房", mapQuery: "이비스 앰배서더 서울 명동", note: "早餐后办理退房，确认行李。", category: "hotel" },
        { time: "09:30", timezone: "+09:00", title: "机场大巴6015 → 仁川T1", mapQuery: "명동역", note: "在宜必思明洞酒店门口上车，约70–90分钟，₩17,000。", category: "bus" },
        { time: "11:00", timezone: "+09:00", title: "仁川国际机场", mapQuery: "인천국제공항", note: "国际航班建议提前约3小时抵达，办理登机。", category: "flight" },
        { time: "12:30", timezone: "+09:00", title: "午餐：机上餐（CX439）", mapQuery: "인천국제공항", note: "登机后由国泰航空提供。", category: "meal" },
        { time: "13:40", timezone: "+09:00", title: "CX439 仁川 → 香港", mapQuery: "인천국제공항", note: "13:40 起飞，约16:30 抵达香港。", category: "flight" },
        { time: "16:30", timezone: "+08:00", title: "抵达香港国际机场", mapQuery: "香港国际机场", note: "行程结束，欢迎回家。", category: "flight" }
      ]
    }
  ],

  // 待办清单：勾选状态保存在浏览器 localStorage。
  checklist: [
    {
      category: "证件与文件",
      items: [
        { id: "passport", text: "护照（确认有效期）" },
        { id: "hkid", text: "香港身份证" },
        { id: "e-arrival-card", text: "填写韩国电子入境卡 e-Arrival Card（出发前3天内在线提交）", url: "https://www.e-arrivalcard.go.kr/portal/main/index.do" },
        { id: "eticket", text: "航班、酒店、KTX 电子确认单" },
        { id: "travel-insurance", text: "购买旅游保险" },
        { id: "cash", text: "准备韩服旅拍现金 ₩350,000" }
      ]
    },
    {
      category: "衣物与随身",
      items: [
        { id: "outer", text: "薄外套（9月底10月初早晚温差）" },
        { id: "shoes", text: "舒适步行鞋" },
        { id: "hanbok-under", text: "韩服拍摄用浅色打底/无肩带内衣" },
        { id: "sun", text: "防晒帽、墨镜、防晒霜" },
        { id: "clothes", text: "换洗衣物" },
        { id: "toiletries", text: "洗漱用品" },
        { id: "skincare-makeup", text: "护肤美妆用品" },
        { id: "umbrella", text: "折叠雨伞" }
      ]
    },
    {
      category: "电子设备",
      items: [
        { id: "charger", text: "手机充电器 + 韩国转换插头" },
        { id: "powerbank", text: "充电宝" },
        { id: "t-money", text: "T-money 交通卡（到机场再买也可）" },
        { id: "camera", text: "相机或手机外接镜头" }
      ]
    },
    {
      category: "药品与护理",
      items: [
        { id: "medicine", text: "个人常备药、肠胃药、止痛药、创可贴" },
        { id: "postcare", text: "医美后修复霜、防晒、温和洁面" }
      ]
    },
    {
      category: "预约与软件",
      items: [
        { id: "ktx-busan", text: "购买 9.26 首尔→釜山 KTX" },
        { id: "sky-capsule", text: "天空胶囊不乘车：改去青沙浦拍照点" },
        { id: "spaland", text: "预约 9.28 SPALAND 汗蒸（新世界 Centum City）" },
        { id: "kimchi", text: "预约 9.29 明洞泡菜体验" },
        { id: "clinic-address", text: "确认城南医美诊所名称/地址" },
        { id: "apps", text: "安装 Naver Map、Papago、KORAIL" }
      ]
    }
  ],

  // 明洞药妆店与护肤推荐（适合 52 岁女性，重点：紧致提拉 / 祛斑美白 / 医美后养护）。
  skincare: {
    note: "以下为熟龄肌常见的紧致、淡斑与医美后修护选项；医美后请以修复霜 + 防晒为主，先避开含酸、A醇/视黄醇等刺激成分。",
    stores: [
      {
        zh: "Olive Young 明洞旗舰店",
        ko: "올리브영 명동본점",
        en: "Olive Young Myeongdong",
        note: "韩国最大连锁药妆店，护肤、彩妆、面膜齐全，适合一次买齐。"
      },
      {
        zh: "乐天免税店 明洞店",
        ko: "롯데면세점 명동점",
        en: "Lotte Duty Free Myeongdong",
        note: "高端护肤免税价；记得带护照办理免税/退税。"
      },
      {
        zh: "新世界百货 明洞店",
        ko: "신세계백화점 명동점",
        en: "Shinsegae Department Store Myeongdong",
        note: "专柜品牌多，可现场试用肤感。"
      }
    ],
    groups: [
      {
        category: "紧致提拉",
        items: [
          { zh: "雪花秀 滋盈肌本精华", ko: "설화수 윤조에센스", en: "Sulwhasoo First Care Activating Serum" },
          { zh: "后 · 秘贴精华", ko: "후 비첩자생에센스", en: "The History of Whoo Bichup Ja Saeng Essence" },
          { zh: "AHC 视黄醇紧致精华", ko: "AHC 리얼 레티놀 세럼", en: "AHC Real Retinol Serum" }
        ]
      },
      {
        category: "祛斑美白",
        items: [
          { zh: "果达儿 青橘维C淡斑精华", ko: "구달 청귤 비타C 세럼", en: "Goodal Green Tangerine Vita C Serum" },
          { zh: "美迪惠尔 维C亮肤面膜", ko: "메디힐 비타C 마스크", en: "Mediheal Vitamin C Mask" }
        ]
      },
      {
        category: "医美后养护",
        items: [
          { zh: "爱斯得拉 屏障修复霜", ko: "에스트라 아토베리어365 크림", en: "Aestura Atobarrier 365 Cream" },
          { zh: "理肤泉 B5修复霜", ko: "라로슈포제 시카플라스트 밤 B5", en: "La Roche-Posay Cicaplast Baume B5" },
          { zh: "Dr.Jart+ 积雪草修护系列", ko: "닥터자르트 시카페어", en: "Dr.Jart+ Cicapair" },
          { zh: "柔恩莱 白桦树保湿防晒", ko: "라운드랩 자작나무 수분 선크림", en: "Round Lab Birch Juice Moisturizing Sunscreen" }
        ]
      }
    ],
    tips: [
      "医美后 48 小时内暂停使用酸类、A醇/视黄醇、磨砂类产品，先以修复霜和防晒为主。",
      "选购时认准韩文成分表（성분표），可用 Papago 拍照翻译。",
      "Olive Young 常有 1+1 活动；满额退税记得在结账时出示护照。"
    ]
  },

  // 赴韩旅游注意事项（页面最下方展示）。
  notes: {
    groups: [
      {
        title: "入境与证件",
        items: [
          "香港特区护照可免签短期停留（当前通常无需 K-ETA），出发前 3 天内在官方 e-Arrival Card 网站提交电子入境卡。",
          "确保护照有效期超过 6 个月，随身携带酒店、回程航班等确认单备查。"
        ]
      },
      {
        title: "交通与支付",
        items: [
          "到机场后购买并充值 T-money，地铁、公交、便利店通用，余额不足可在地铁站或便利店充值。",
          "韩元现金仍常用于市场、小餐厅和景点；旅拍需准备 ₩350,000 现金。",
          "多数商家可刷卡（Visa/Master 通行），银联部分可用；小额消费建议备现金。"
        ]
      },
      {
        title: "通讯与网络",
        items: [
          "出发前购买韩国 eSIM / SIM 卡或租随身 WiFi，保证全程有网。",
          "建议提前安装 Naver Map（导航）、Papago（翻译）、KORAIL（火车票）等应用。"
        ]
      },
      {
        title: "礼仪与文化",
        items: [
          "地铁车厢保持安静，主动让座给长者；自动扶梯靠右站立，左侧留给赶时间的人。",
          "部分传统韩屋餐厅需脱鞋入内，注意看店家提示。",
          "垃圾分类较严格，住宿时按酒店/民宿提示分类投放。"
        ]
      },
      {
        title: "安全与紧急",
        items: [
          "报警 112、急救/火警 119；中国公民可拨打外交部全球领保热线 +86-10-12308。",
          "保管好护照和随身财物，人流密集处（明洞、广藏市场、地铁）注意背包。"
        ]
      },
      {
        title: "天气、健康与电源",
        items: [
          "9月底10月初早晚温差大，备薄外套；海云台海边风较大，注意保暖。",
          "医美后 48 小时内避免暴晒、饮酒、桑拿和剧烈运动，严格防晒和保湿。",
          "自备常用药；韩国药店需药剂师配药，处方药建议带处方或医生证明。",
          "电压 220V，插座为两圆孔（C/F 型），需带转换插头。"
        ]
      },
      {
        title: "退税",
        items: [
          "单笔满额可办理退税，结账时出示护照并保留单据，离境时在机场核验。",
          "免税店商品按免税价购买；药妆店如 Olive Young 满额同样可退税。"
        ]
      }
    ]
  },

  // 共享记账配置。
  expense: {
    baseCurrency: "KRW",
    currencies: ["KRW", "CNY"],
    // 每个币种折算到 baseCurrency（韩元）的汇率。
    rates: {
      KRW: 1,
      CNY: 192.31
    },
    categories: ["餐饮", "交通", "住宿", "购物", "门票", "其他"],
    payers: ["我", "先生"],
    // JSONBin.io 共享账本配置。留空时使用 localStorage 本机演示模式。
    jsonBin: {
      binId: "6a9c2d6cf5f4af5e296e3c32",
      accessKey: "",
      masterKey: "$2a$10$d8XvxCy7Jr2IUuUAmFvRpOvLR4tw..3VQZxd5xgNnMvE6B5/XvktW"
    }
  }
};
