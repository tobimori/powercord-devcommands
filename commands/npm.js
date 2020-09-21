const { get } = require('powercord/http')

module.exports = {
  command: 'npm',
  description: 'Search for packages in the NPM registry',
  usage: '{c} [--page <num>] <search query>',
  executor: async (args) => {
    if (args.length === 0) return ({
      send: false,
      result: '**No search query provided!**'
    })

    let page = 1
    if (args[0] == '--page') {
      if (!isFinite(args[1])) return ({
        send: false,
        result: '**Page number is not a number!**'
      })

      page = parseInt(args[1])
      args.splice(0, 2)
    }

    try {
      const req = await get(`http://registry.npmjs.com/-/v1/search?text=${encodeURI(args.join(' '))}&size=5&from=${page * 5 - 5}`)
      const data = await req.body

      if (data.total === 0) return ({
        send: false,
        result: '**No results found!**'
      })


      let items = ''
      data.objects.map((e) => {
        const facts = []
        e.package.version && facts.push(`:pushpin: Version ${e.package.version}`)
        e.package.date && facts.push(`:arrow_up: Updated ${new Date(e.package.date).toLocaleDateString()}`)

        let keywords = []
        e.package.keywords && (keywords = e.package.keywords.map((k) => `[#${k}](https://www.npmjs.com/search?q=keywords:${k})`))

        items += `[**${e.package.name}**](${e.package.links.npm})\n`
        e.package.description && (items += `*${e.package.description}*\n`)
        keywords.length && (items += `${keywords.join(' ')}\n`)
        items += `${facts.join(' — ')}\n\n`
      })

      const embed = {
        type: 'rich',
        title: `NPM results for **${args.join(' ')}**`,
        description: items,
        url: `https://www.npmjs.com/search?q=${encodeURI(args.join(' '))}`,
        author: {
          name: `Page ${page} of ${Math.ceil(data.total / 5).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
        },
        footer: {
          text: `Found ${data.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} results`,
          icon_url: 'https://pbs.twimg.com/profile_images/1285630920263966721/Uk6O1QGC_400x400.jpg'
        }
      }

      return ({
        send: false,
        result: embed
      })
    } catch (e) {
      console.error(e)

      return ({
        send: false,
        result: '**Search failed.**'
      })
    }
  }
};