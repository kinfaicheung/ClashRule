/**
 * Clash Verge Rev 全局扩展脚本（懒人配置）/ Mihomo Party 覆写脚本
 * URL: https://github.com/dahaha-365/YaNet/
 */

/**
 * 脚本总开关
 * true = 启用
 * false = 禁用
 */
const enable = true

/**
 * 分流规则配置
 * 遵循“最小，可用”原则，可禁用不需要的规则以提高效率
 */
const ruleOptions = {
  apple: true,      // 苹果服务
  microsoft: true,  // 微软服务
  google: true,     // Google服务
  openai: true,     // 国外AI和GPT
  spotify: true,    // Spotify
  youtube: true,    // YouTube
  bahamut: true,    // 巴哈姆特/动画疯
  netflix: true,    // Netflix网飞
  tiktok: true,     // 国际版抖音
  disney: true,     // 迪士尼
  pixiv: true,      // Pixiv
  hbo: true,        // HBO
  biliintl: true,   // 哔哩哔哩东南亚
  tvb: true,        // TVB
  hulu: true,       // Hulu
  primevideo: true, // 亚马逊Prime Video
  telegram: true,   // Telegram
  line: true,       // Line
  whatsapp: true,   // WhatsApp
  games: true,      // 游戏策略组
  japan: true,      // 日本网站
  tracker: true,    // 跟踪分析服务
  ads: true,        // 广告过滤
}

/**
 * 地区配置
 * 通过正则表达式匹配代理节点名称，excludeHighPercentage排除高倍率节点
 */
const regionOptions = {
  excludeHighPercentage: true,
  regions: [
    { name: 'HK香港', regex: /港|🇭🇰|hk|hongkong|hong kong/i, ratioLimit: 2, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Hong_Kong.png' },
    { name: 'US美国', regex: /美|🇺🇸|us|united state|america/i, ratioLimit: 2, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/United_States.png' },
    { name: 'JP日本', regex: /日本|🇯🇵|jp|japan/i, ratioLimit: 2, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Japan.png' },
    { name: 'KR韩国', regex: /韩|🇰🇷|kr|korea/i, ratioLimit: 2, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Korea.png' },
    { name: 'SG新加坡', regex: /新加坡|🇸🇬|sg|singapore/i, ratioLimit: 2, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Singapore.png' },
    { name: 'CN中国大陆', regex: /中国|🇨🇳|cn|china/i, ratioLimit: 2, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/China_Map.png' },
    { name: 'TW台湾省', regex: /台湾|🇹🇼|tw|taiwan|tai wan/i, ratioLimit: 2, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/China.png' },
    { name: 'GB英国', regex: /英|🇬🇧|uk|united kingdom|great britain/i, ratioLimit: 2, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/United_Kingdom.png' },
    { name: 'DE德国', regex: /德国|🇩🇪|de|germany/i, ratioLimit: 2, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Germany.png' },
    { name: 'MY马来西亚', regex: /马来|🇲🇾|my|malaysia/i, ratioLimit: 2, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Malaysia.png' },
    { name: 'TK土耳其', regex: /土耳其|🇹🇷|tk|turkey/i, ratioLimit: 2, icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Turkey.png' },
  ],
}

/**
 * DNS 配置
 */
const defaultDNS = ['tls://223.5.5.5']
const chinaDNS = ['119.29.29.29', '223.5.5.5']
const foreignDNS = ['https://120.53.53.53/dns-query', 'https://223.5.5.5/dns-query']

const dnsConfig = {
  enable: true,
  listen: ':1053',
  ipv6: true,
  'prefer-h3': true,
  'use-hosts': true,
  'use-system-hosts': true,
  'respect-rules': true,
  'enhanced-mode': 'fake-ip',
  'fake-ip-range': '198.18.0.1/16',
  'fake-ip-filter': ['*', '+.lan', '+.local', '+.market.xiaomi.com'],
  nameserver: [...foreignDNS],
  'proxy-server-nameserver': [...foreignDNS],
  'nameserver-policy': {
    'geosite:private': 'system',
    'geosite:cn,steam@cn,category-games@cn,microsoft@cn,apple@cn': chinaDNS,
  },
}

/**
 * 规则集和代理组通用配置
 */
const ruleProviderCommon = { type: 'http', format: 'yaml', interval: 86400 }
const groupBaseOption = {
  interval: 300,
  timeout: 3000,
  url: 'http://cp.cloudflare.com/generate_204',
  lazy: true,
  'max-failed-times': 3,
  hidden: false,
}

const ruleProviders = new Map()
ruleProviders.set('applications', {
  ...ruleProviderCommon,
  behavior: 'classical',
  format: 'text',
  url: 'https://fastly.jsdelivr.net/gh/DustinWin/ruleset_geodata@clash-ruleset/applications.list',
  path: './ruleset/DustinWin/applications.list',
})

const rules = [
  'RULE-SET,applications,下载软件',
  'PROCESS-NAME,SunloginClient,DIRECT',
  'PROCESS-NAME,SunloginClient.exe,DIRECT',
]

/**
 * 主函数
 */
function main(config) {
  const proxyCount = config?.proxies?.length ?? 0
  const proxyProviderCount = typeof config?.['proxy-providers'] === 'object' ? Object.keys(config['proxy-providers']).length : 0
  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error('配置文件中未找到任何代理')
  }

  let regionProxyGroups = []
  let otherProxyGroups = config.proxies.map((b) => b.name)

  config['allow-lan'] = true
  config['bind-address'] = '*'
  config['mode'] = 'rule'
  config['dns'] = dnsConfig
  config['profile'] = { 'store-selected': true, 'store-fake-ip': true }
  config['unified-delay'] = true
  config['tcp-concurrent'] = true
  config['keep-alive-interval'] = 1800
  config['find-process-mode'] = 'strict'
  config['geodata-mode'] = true
  config['geodata-loader'] = 'memconservative'
  config['geo-auto-update'] = true
  config['geo-update-interval'] = 24
  config['sniffer'] = {
    enable: true,
    'force-dns-mapping': true,
    'parse-pure-ip': true,
    'override-destination': false,
    sniff: {
      TLS: { ports: [443, 8443] },
      HTTP: { ports: [80, '8080-8880'] },
      QUIC: { ports: [443, 8443] },
    },
    'force-domain': [],
    'skip-domain': ['Mijia Cloud', '+.oray.com'],
  }
  config['ntp'] = {
    enable: true,
    'write-to-system': false,
    server: 'cn.ntp.org.cn',
  }
  config['geox-url'] = {
    geoip: 'https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip-lite.dat',
    geosite: 'https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat',
    mmdb: 'https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/country-lite.mmdb',
    asn: 'https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/GeoLite2-ASN.mmdb',
  }

  if (!enable) return config

  regionOptions.regions.forEach((region) => {
    let proxies = config.proxies
      .filter((a) => {
        const multiplier = /(?<=[xX✕✖⨉倍率])([1-9]+(\.\d+)*|0{1}\.\d+)(?=[xX✕✖⨉倍率])*/i.exec(a.name)?.[1]
        return a.name.match(region.regex) && parseFloat(multiplier || '0') <= region.ratioLimit
      })
      .map((b) => b.name)
    if (proxies.length > 0) {
      regionProxyGroups.push({
        ...groupBaseOption,
        name: region.name,
        type: 'url-test',
        tolerance: 50,
        icon: region.icon,
        proxies: proxies,
      })
    }
    otherProxyGroups = otherProxyGroups.filter((x) => !proxies.includes(x))
  })

  const proxyGroupsRegionNames = regionProxyGroups.map((value) => value.name)
  if (otherProxyGroups.length > 0) proxyGroupsRegionNames.push('其他节点')

  config['proxy-groups'] = [{
    ...groupBaseOption,
    name: '默认节点',
    type: 'select',
    proxies: [...proxyGroupsRegionNames, 'DIRECT'],
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Proxy.png',
  }]

  /**
  config.proxies = config?.proxies || []
  config.proxies.push({ name: '直连', type: 'direct', udp: true })
  */

  if (ruleOptions.openai) {
    rules.push('DOMAIN-SUFFIX,grazie.ai,国外AI', 'DOMAIN-SUFFIX,grazie.aws.intellij.net,国外AI', 'RULE-SET,ai,国外AI')
    ruleProviders.set('ai', {
      ...ruleProviderCommon,
      behavior: 'classical',
      format: 'text',
      url: 'https://github.com/dahaha-365/YaNet/raw/refs/heads/dist/rulesets/mihomo/ai.list',
      path: './ruleset/YaNet/ai.list',
    })
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: '国外AI',
      type: 'select',
      proxies: ['默认节点', ...proxyGroupsRegionNames, 'DIRECT'],
      url: 'https://chat.openai.com/cdn-cgi/trace',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/ChatGPT.png',
    })
  }

  if (ruleOptions.youtube) {
    rules.push('GEOSITE,youtube,YouTube')
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: 'YouTube',
      type: 'select',
      proxies: ['默认节点', ...proxyGroupsRegionNames, 'DIRECT'],
      url: 'https://www.youtube.com/s/desktop/494dd881/img/favicon.ico',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/YouTube.png',
    })
  }

  if (ruleOptions.biliintl) {
    rules.push('GEOSITE,biliintl,哔哩哔哩东南亚')
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: '哔哩哔哩东南亚',
      type: 'select',
      proxies: ['默认节点', 'DIRECT', ...proxyGroupsRegionNames],
      url: 'https://www.bilibili.tv/',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/bilibili_3.png',
    })
  }

  if (ruleOptions.bahamut) {
    rules.push('GEOSITE,bahamut,巴哈姆特')
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: '巴哈姆特',
      type: 'select',
      proxies: ['默认节点', 'DIRECT', ...proxyGroupsRegionNames],
      url: 'https://ani.gamer.com.tw/ajax/getdeviceid.php',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Bahamut.png',
    })
  }

  if (ruleOptions.disney) {
    rules.push('GEOSITE,disney,Disney+')
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: 'Disney+',
      type: 'select',
      proxies: ['默认节点', ...proxyGroupsRegionNames, 'DIRECT'],
      url: 'https://disney.api.edge.bamgrid.com/devices',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Disney+.png',
    })
  }

  if (ruleOptions.netflix) {
    rules.push('GEOSITE,netflix,NETFLIX')
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: 'NETFLIX',
      type: 'select',
      proxies: ['默认节点', ...proxyGroupsRegionNames, 'DIRECT'],
      url: 'https://api.fast.com/netflix/speedtest/v2?https=true',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Netflix.png',
    })
  }

  if (ruleOptions.tiktok) {
    rules.push('GEOSITE,tiktok,Tiktok')
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: 'Tiktok',
      type: 'select',
      proxies: ['默认节点', ...proxyGroupsRegionNames, 'DIRECT'],
      url: 'https://www.tiktok.com/',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/TikTok.png',
    })
  }

  if (ruleOptions.spotify) {
    rules.push('GEOSITE,spotify,Spotify')
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: 'Spotify',
      type: 'select',
      proxies: ['默认节点', ...proxyGroupsRegionNames, 'DIRECT'],
      url: 'http://spclient.wg.spotify.com/signup/public/v1/account',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Spotify.png',
    })
  }

  if (ruleOptions.pixiv) {
    rules.push('GEOSITE,pixiv,Pixiv')
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: 'Pixiv',
      type: 'select',
      proxies: ['默认节点', ...proxyGroupsRegionNames, 'DIRECT'],
      url: 'https://www.pixiv.net/favicon.ico',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Pig.png',
    })
  }

  if (ruleOptions.hbo) {
    rules.push('GEOSITE,hbo,HBO')
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: 'HBO',
      type: 'select',
      proxies: ['默认节点', ...proxyGroupsRegionNames, 'DIRECT'],
      url: 'https://www.hbo.com/favicon.ico',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/HBO.png',
    })
  }

  if (ruleOptions.tvb) {
    rules.push('GEOSITE,tvb,TVB')
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: 'TVB',
      type: 'select',
      proxies: ['默认节点', ...proxyGroupsRegionNames, 'DIRECT'],
      url: 'https://www.tvb.com/logo_b.svg',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/TVB.png',
    })
  }

  if (ruleOptions.primevideo) {
    rules.push('GEOSITE,primevideo,Prime Video')
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: 'Prime Video',
      type: 'select',
      proxies: ['默认节点', ...proxyGroupsRegionNames, 'DIRECT'],
      url: 'https://m.media-amazon.com/images/G/01/digital/video/web/logo-min-remaster.png',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Prime_Video.png',
    })
  }

  if (ruleOptions.hulu) {
    rules.push('GEOSITE,hulu,Hulu')
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: 'Hulu',
      type: 'select',
      proxies: ['默认节点', ...proxyGroupsRegionNames, 'DIRECT'],
      url: 'https://auth.hulu.com/v4/web/password/authenticate',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Hulu.png',
    })
  }

  if (ruleOptions.telegram) {
    rules.push('GEOIP,telegram,Telegram')
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: 'Telegram',
      type: 'select',
      proxies: ['默认节点', ...proxyGroupsRegionNames, 'DIRECT'],
      url: 'http://www.telegram.org/img/website_icon.svg',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Telegram.png',
    })
  }

  if (ruleOptions.whatsapp) {
    rules.push('GEOSITE,whatsapp,WhatsApp')
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: 'WhatsApp',
      type: 'select',
      proxies: ['默认节点', ...proxyGroupsRegionNames, 'DIRECT'],
      url: 'https://web.whatsapp.com/data/manifest.json',
      icon: 'https://images.icon-icons.com/373/PNG/256/Whatsapp_37229.png',
    })
  }

  if (ruleOptions.line) {
    rules.push('GEOSITE,line,Line')
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: 'Line',
      type: 'select',
      proxies: ['默认节点', ...proxyGroupsRegionNames, 'DIRECT'],
      url: 'https://line.me/page-data/app-data.json',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Line.png',
    })
  }

  if (ruleOptions.games) {
    rules.push('GEOSITE,category-games@cn,国内网站', 'GEOSITE,category-games,游戏专用')
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: '游戏专用',
      type: 'select',
      proxies: ['默认节点', ...proxyGroupsRegionNames, 'DIRECT'],
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Game.png',
    })
  }

  if (ruleOptions.tracker) {
    rules.push('GEOSITE,tracker,跟踪分析')
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: '跟踪分析',
      type: 'select',
      proxies: ['REJECT', 'DIRECT', '默认节点'],
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Reject.png',
    })
  }

  if (ruleOptions.ads) {
    rules.push('GEOSITE,category-ads-all,广告过滤')
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: '广告过滤',
      type: 'select',
      proxies: ['REJECT', 'DIRECT', '默认节点'],
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Advertising.png',
    })
  }

  if (ruleOptions.apple) {
    rules.push('GEOSITE,apple-cn,苹果服务')
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: '苹果服务',
      type: 'select',
      proxies: ['默认节点', ...proxyGroupsRegionNames, 'DIRECT'],
      url: 'http://www.apple.com/library/test/success.html',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Apple_2.png',
    })
  }

  if (ruleOptions.google) {
    rules.push('GEOSITE,google,谷歌服务')
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: '谷歌服务',
      type: 'select',
      proxies: ['默认节点', ...proxyGroupsRegionNames, 'DIRECT'],
      url: 'http://www.google.com/generate_204',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Google_Search.png',
    })
  }

  if (ruleOptions.microsoft) {
    rules.push('GEOSITE,microsoft@cn,国内网站', 'GEOSITE,microsoft,微软服务')
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: '微软服务',
      type: 'select',
      proxies: ['DIRECT', '默认节点', ...proxyGroupsRegionNames],
      url: 'http://www.msftconnecttest.com/connecttest.txt',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Microsoft.png',
    })
  }

  if (ruleOptions.japan) {
    rules.push('RULE-SET,category-bank-jp,日本网站', 'GEOIP,jp,日本网站,no-resolve')
    ruleProviders.set('category-bank-jp', {
      ...ruleProviderCommon,
      behavior: 'domain',
      format: 'mrs',
      url: 'https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/category-bank-jp.mrs',
      path: './ruleset/MetaCubeX/category-bank-jp.mrs',
    })
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: '日本网站',
      type: 'select',
      proxies: ['默认节点', ...proxyGroupsRegionNames, 'DIRECT'],
      url: 'https://r.r10s.jp/com/img/home/logo/touch.png',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/JP.png',
    })
  }

  rules.push(
    'GEOSITE,private,DIRECT',
    'GEOIP,private,DIRECT,no-resolve',
    'GEOSITE,cn,国内网站',
    'GEOIP,cn,国内网站,no-resolve',
    'MATCH,其他外网'
  )
  config['proxy-groups'].push(
    {
      ...groupBaseOption,
      name: '下载软件',
      type: 'select',
      proxies: ['DIRECT', 'REJECT', '默认节点', '国内网站', ...proxyGroupsRegionNames],
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Download.png',
    },
    {
      ...groupBaseOption,
      name: '其他外网',
      type: 'select',
      proxies: ['默认节点', '国内网站', ...proxyGroupsRegionNames],
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Streaming!CN.png',
    },
    {
      ...groupBaseOption,
      name: '国内网站',
      type: 'select',
      proxies: ['DIRECT', '默认节点', ...proxyGroupsRegionNames],
      url: 'http://wifi.vivo.com.cn/generate_204',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/StreamingCN.png',
    }
  )

  config['proxy-groups'] = config['proxy-groups'].concat(regionProxyGroups)
  config['rules'] = rules
  config['rule-providers'] = Object.fromEntries(ruleProviders)

  if (otherProxyGroups.length > 0) {
    config['proxy-groups'].push({
      ...groupBaseOption,
      name: '其他节点',
      type: 'select',
      proxies: otherProxyGroups,
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/World_Map.png',
    })
  }

  return config
}
