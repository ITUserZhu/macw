/*
 * @Author: Liliang Zhu 
 * @Date: 2020-04-28 15:29:11 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2020-04-28 16:24:25
 * 图片编辑字体
 */


const family = [{
    family: '文泉驿微米黑',
    category: 'display',
    filePath: '/文泉驿微米黑.ttf',
    type: 'custom'
  },
  {
    family: '文泉驿等宽正黑',
    category: 'display',
    filePath: '/文泉驿等宽正黑.ttf',
    type: 'custom'
  },
  {
    family: '文泉驿等宽微米黑',
    category: 'display',
    filePath: '/文泉驿等宽微米黑.ttf',
    type: 'custom'
  },

  {
    family: '超极细字型',
    category: 'display',
    filePath: '/超极细字型.ttf',
    type: 'custom'
  },
  {
    family: '汉仪贤二体',
    category: 'display',
    filePath: '/汉仪贤二体.ttf',
    type: 'custom'
  },
  {
    family: '濑户字体',
    category: 'display',
    filePath: '/濑户字体.ttf',
    type: 'custom'
  },
  {
    family: '庞门正道标题体',
    category: 'display',
    filePath: '/庞门正道标题体.ttf',
    type: 'custom'
  },
  {
    family: '日本花园明朝体',
    category: 'display',
    filePath: '/日本花园明朝体.ttf',
    type: 'custom'
  },
  {
    family: '锐字真言体',
    category: 'display',
    filePath: '/锐字真言体.ttf',
    type: 'custom'
  },
  {
    family: '雅黑',
    category: 'display',
    filePath: '/雅黑.ttf',
    type: 'custom'
  },

  {
    family: '手书体',
    category: 'handwriting',
    filePath: '/手书体.ttf',
    type: 'custom'
  },
  {
    family: '沐瑶软笔手写体',
    category: 'handwriting',
    filePath: '/沐瑶软笔手写体.ttf',
    type: 'custom'
  },
  // 英文字体1
  {
    family: 'AndaleMono',
    category: 'monospace',
    filePath: '/AndaleMono-1.ttf',
    type: 'custom'
  },
  {
    family: 'Anonymous',
    category: 'monospace',
    filePath: '/Anonymous-Pro-B-1.ttf',
    type: 'custom'
  },
  {
    family: 'CamingoCode-Regular',
    category: 'monospace',
    filePath: '/CamingoCode-Regular-1.ttf',
    type: 'custom'
  },
  {
    family: 'ConsolaMono',
    category: 'monospace',
    filePath: '/ConsolaMono-2.ttf',
    type: 'custom'
  },
  {
    family: 'ConsolaMono-Bold',
    category: 'monospace',
    filePath: '/ConsolaMono-Bold-1.ttf',
    type: 'custom'
  },
  {
    family: 'cour',
    category: 'monospace',
    filePath: '/cour-2.ttf',
    type: 'custom'
  },
  {
    family: 'Courier',
    category: 'monospace',
    filePath: '/Courier-12.ttf',
    type: 'custom'
  },
  {
    family: 'Courier-BOLD',
    category: 'monospace',
    filePath: '/Courier-BOLDITALIC-1.ttf',
    type: 'custom'
  },
  {
    family: 'Courier-B-I',
    category: 'monospace',
    filePath: '/Courier-Bold-Italic-SWA-1.ttf',
    type: 'custom'
  },
  {
    family: 'Courier-ITALIC',
    category: 'monospace',
    filePath: '/Courier-ITALIC-6.ttf',
    type: 'custom'
  },

  // 英文字体2
  {
    family: 'Courier-Italic',
    category: 'sans-serif',
    filePath: '/Courier-Italic-SWA-5.ttf',
    type: 'custom'
  },
  {
    family: 'Cousine-Italic',
    category: 'sans-serif',
    filePath: '/Cousine-Italic-2.ttf',
    type: 'custom'
  },
  {
    family: 'Cousine-Regular',
    category: 'sans-serif',
    filePath: '/Cousine-Regular-1.ttf',
    type: 'custom'
  },
  {
    family: 'CutiveMono-Regular',
    category: 'sans-serif',
    filePath: '/CutiveMono-Regular-1.ttf',
    type: 'custom'
  },
  {
    family: 'DejaVuMathTeXGyre',
    category: 'sans-serif',
    filePath: '/DejaVuMathTeXGyre-2.ttf',
    type: 'custom'
  },
  {
    family: 'DejaVuSans',
    category: 'sans-serif',
    filePath: '/DejaVuSans-7.ttf',
    type: 'custom'
  },
  {
    family: 'DeVuSansCondensed',
    category: 'sans-serif',
    filePath: '/DejaVuSansCondensed-15.ttf',
    type: 'custom'
  },
  {
    family: 'DejaVuSansdensed',
    category: 'sans-serif',
    filePath: '/DejaVuSansCondensed-Bold-8.ttf',
    type: 'custom'
  },
  {
    family: 'DejaVuCondensed-Bold',
    category: 'sans-serif',
    filePath: '/DejaVuSansCondensed-BoldOblique-16.ttf',
    type: 'custom'
  },

  // 英文字体3
  {
    family: 'DejaVuSansMono',
    category: 'serif',
    filePath: '/DejaVuSansMono-1.ttf',
    type: 'custom'
  },
  {
    family: 'DejaVuSansMono-Bold',
    category: 'serif',
    filePath: '/DejaVuSansMono-BoldOblique-13.ttf',
    type: 'custom'
  },
  {
    family: 'DejaVuSerif',
    category: 'serif',
    filePath: '/DejaVuSerif-18.ttf',
    type: 'custom'
  },
  {
    family: 'DroidSansMono',
    category: 'serif',
    filePath: '/DroidSansMono-1.ttf',
    type: 'custom'
  },
  {
    family: 'Envy-Code',
    category: 'serif',
    filePath: '/Envy-Code-R-3.ttf',
    type: 'custom'
  },
  {
    family: 'Envy',
    category: 'serif',
    filePath: '/Envy-Code-R-Bold-1.ttf',
    type: 'custom'
  },
  {
    family: 'Envy-Itali',
    category: 'serif',
    filePath: '/Envy-Code-R-Italic-2.ttf',
    type: 'custom'
  },
  {
    family: 'EspressoMonoBold',
    category: 'serif',
    filePath: '/EspressoMonoBold-2.ttf',
    type: 'custom'
  },
  {
    family: 'Hack-Bold',
    category: 'serif',
    filePath: '/Hack-Bold-1.ttf',
    type: 'custom'
  },
  {
    family: 'iosevka-bold',
    category: 'serif',
    filePath: '/iosevka-bold-1.ttf',
    type: 'custom'
  },
  {
    family: 'VeraMoBd',
    category: 'serif',
    filePath: '/VeraMoBd-1.ttf',
    type: 'custom'
  },
  {
    family: 'VeraMoBI',
    category: 'serif',
    filePath: '/VeraMoBI-2.ttf',
    type: 'custom'
  },
  {
    family: 'VeraMoIt',
    category: 'serif',
    filePath: '/VeraMoIt-3.ttf',
    type: 'custom'
  },
  {
    family: 'VeraMono',
    category: 'serif',
    filePath: '/VeraMono-4.ttf',
    type: 'custom'
  },

]

export default family;
// monospace  sans-serif  serif