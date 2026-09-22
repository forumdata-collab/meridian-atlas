// Classical route summaries and modern point identities are kept separate from geometry.
export const luoSource = {
  title: '《靈樞經》四庫全書本 · 卷三 · 經脈第十',
  url: 'https://zh.wikisource.org/w/index.php?title=靈樞經_(四庫全書本)/卷03&oldid=640550',
  note: '依據公開古籍轉錄整理循行，原文節選補加標點；古文距離、異名與現代國標定位分開閲讀。十五絡不是十五個新穴，也不另配十五個時辰。',
};
export type LuoStudy = {
  id: string;
  name: string;
  parent: string;
  pointId: string;
  connection: string;
  summary: string;
  excerpt: string;
  note?: string;
};
export const luoStudies: LuoStudy[] = [
  {
    id: 'LUO-LU',
    name: '手太陰絡脈',
    parent: 'LU',
    pointId: 'LU7',
    connection: '別走手陽明',
    summary: '列缺分出，隨手太陰經直入掌中，散於魚際；並與手陽明相聯繫。',
    excerpt:
      '手太隂之別名曰列缺，起於腕上分間，並太隂之經，直入掌中，散入於魚際。',
    note: '原文中的古代距離不替代列缺現行國標定位。別走表裏經不等於直接連到對方原穴。',
  },
  {
    id: 'LUO-LI',
    name: '手陽明絡脈',
    parent: 'LI',
    pointId: 'LI6',
    connection: '別入手太陰',
    summary:
      '偏歷分出，聯繫手太陰；另一支沿臂、肩髃上行至頰、齒，又分支入耳，合於宗脈。',
    excerpt:
      '手陽明之別名曰偏歴，去腕三寸，別入太隂。其別者上循臂乘肩髃，上曲頰偏齒；其別者入耳，合於宗脈。',
  },
  {
    id: 'LUO-ST',
    name: '足陽明絡脈',
    parent: 'ST',
    pointId: 'ST40',
    connection: '別走足太陰',
    summary:
      '豐隆分出，聯繫足太陰；沿脛骨外側向上聯繫頭項、會合諸經之氣，再向下聯繫喉咽。',
    excerpt:
      '足陽明之別名曰豐隆，去踝八寸，別走太隂。其別者循脛骨外亷，上絡頭項，合諸經之氣，下絡喉嗌。',
  },
  {
    id: 'LUO-SP',
    name: '足太陰絡脈',
    parent: 'SP',
    pointId: 'SP4',
    connection: '別走足陽明',
    summary: '公孫分出，聯繫足陽明；另一支向內聯繫腸胃。',
    excerpt: '足太隂之別名曰公孫，去本節之後一寸，別走陽明。其別者入絡腸胃。',
  },
  {
    id: 'LUO-HT',
    name: '手少陰絡脈',
    parent: 'HT',
    pointId: 'HT5',
    connection: '別走手太陽',
    summary: '通裏分出，上行入心中，聯繫舌根和目系；並與手太陽相聯繫。',
    excerpt:
      '手少隂之別名曰通裏，去腕一寸半，別而上行，循經入於心中，繫舌本，屬目系。',
    note: '本轉錄先寫“去腕一寸半”，後有“取之掌後一寸”；穴位詳情以現行國標為準。',
  },
  {
    id: 'LUO-SI',
    name: '手太陽絡脈',
    parent: 'SI',
    pointId: 'SI7',
    connection: '內注手少陰',
    summary: '支正分出，向內聯繫手少陰；另向上至肘，聯繫肩髃區域。',
    excerpt: '手太陽之別名曰支正，上腕五寸，內注少隂。其別者上走肘，絡肩髃。',
  },
  {
    id: 'LUO-BL',
    name: '足太陽絡脈',
    parent: 'BL',
    pointId: 'BL58',
    connection: '別走足少陰',
    summary: '飛揚分出，聯繫足少陰。原文未列出這段聯繫的全部經過區域。',
    excerpt: '足太陽之別名曰飛陽，去踝七寸，別走少隂。',
    note: '古名“飛陽”對應今名飛揚；示意只表達經間聯繫，不編造固定終點穴。',
  },
  {
    id: 'LUO-KI',
    name: '足少陰絡脈',
    parent: 'KI',
    pointId: 'KI4',
    connection: '別走足太陽',
    summary:
      '大鐘在內踝後分出，繞跟聯繫足太陽；另隨經上達心包，並向下貫入腰脊。',
    excerpt:
      '足少隂之別名曰大鍾，當踝後繞跟，別走太陽。其別者並經上走於心包，下外貫腰脊。',
    note: '繞跟段已貼合當前模型腳跟表面；崑崙只作足太陽側的繪圖參照，不認定為固定終點。體表貼合不等於精確解剖驗證。',
  },
  {
    id: 'LUO-PC',
    name: '手厥陰絡脈',
    parent: 'PC',
    pointId: 'PC6',
    connection: '聯繫心包絡、心繫',
    summary: '內關從兩筋之間分出，隨經上行，聯繫心包絡與心繫。',
    excerpt:
      '手心主之別名曰內關，去腕二寸，出於兩筋之間，循經以上，繫於心包絡心繫。',
    note: '所選《靈樞》本條沒有逐字寫“別走少陽”，本圖按該條實際記載繪製；表裏配穴另見配穴頁。',
  },
  {
    id: 'LUO-TE',
    name: '手少陽絡脈',
    parent: 'TE',
    pointId: 'TE5',
    connection: '合於心主',
    summary: '外關分出，繞臂外側，注入胸中，與心主相合。',
    excerpt: '手少陽之別名曰外闗，去腕二寸，外遶臂，注胷中，合心主。',
  },
  {
    id: 'LUO-GB',
    name: '足少陽絡脈',
    parent: 'GB',
    pointId: 'GB37',
    connection: '別走足厥陰',
    summary: '光明分出，聯繫足厥陰，並向下散佈於足背。',
    excerpt: '足少陽之別名曰光明，去踝五寸，別走厥隂，下絡足跗。',
  },
  {
    id: 'LUO-LR',
    name: '足厥陰絡脈',
    parent: 'LR',
    pointId: 'LR5',
    connection: '別走足少陽',
    summary: '蠡溝分出，聯繫足少陽；另沿小腿上行至陰部。',
    excerpt:
      '足厥隂之別名曰蠡溝，去內踝五寸，別走少陽。其別者徑脛上睪，結於莖。',
  },
  {
    id: 'LUO-CV',
    name: '任脈絡',
    parent: 'CV',
    pointId: 'CV15',
    connection: '散佈腹部',
    summary: '從鳩尾區域分出，向下散佈腹部。',
    excerpt: '任脈之別名曰尾翳，下鳩尾，散於腹。',
    note: '本條絡名為“尾翳”，現代絡穴用鳩尾 CV15；保留古今名稱對應。',
  },
  {
    id: 'LUO-GV',
    name: '督脈絡',
    parent: 'GV',
    pointId: 'GV1',
    connection: '左右別走足太陽',
    summary:
      '長強分出，沿脊旁上達項部、散於頭部；至肩胛部左右分走足太陽，並貫入脊旁。',
    excerpt:
      '督脈之別名曰長強，挾膂上項，散頭上，下當肩胛左右，別走太陽，入貫膂。',
  },
  {
    id: 'LUO-SP-MAJOR',
    name: '脾之大絡',
    parent: 'SP',
    pointId: 'SP21',
    connection: '佈於胸脅',
    summary: '大包分出，分佈於胸脅，聯繫周身絡脈。',
    excerpt: '脾之大絡名曰大包，出淵腋下三寸，布胸脇。',
    note: '大包與公孫是十五絡中的兩個獨立條目。胃之大絡虛裏不計入本次十五絡目錄。',
  },
];
export function getLuoStudy(id: string | null | undefined) {
  return luoStudies.find((study) => study.id === id);
}
export const luoMemory =
  '肺列缺，大腸偏歷，胃豐隆，脾公孫；心通裏，小腸支正，膀胱飛揚，腎大鐘；心包內關，三焦外關，膽光明，肝蠡溝；任鳩尾，督長強，脾大絡大包。';
