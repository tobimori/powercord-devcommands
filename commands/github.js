const { get } = require('powercord/http')

module.exports = {
  command: 'gh',
  description: 'Search for repositories on GitHub',
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
      const req = await get(`https://api.github.com/search/repositories?per_page=5&page=1&q=${encodeURI(args.join('+'))}`)
      const data = await req.body

      if (data.total_count === 0) return ({
        send: false,
        result: '**No results found!**'
      })


      let items = ''
      data.items.map((e) => {
        const facts = []
        e.language && facts.push(`:pencil: ${e.language}`)
        e.license && e.license.name !== 'Other' && facts.push(`:page_facing_up: ${e.license.name}`)
        e.stargazers_count && facts.push(`:star: ${e.stargazers_count} Stargazers`)
        e.forks_count && !facts[2] && facts.push(`:fork_and_knife: ${e.forks_count} Forks`)

        items += `[**${e.full_name}**](${e.html_url})\n`
        e.description && (items += `*${e.description}*\n`)
        items += `${facts.join(' — ')}\n\n`
      })

      const embed = {
        type: 'rich',
        title: `GitHub results for **${args.join(' ')}**`,
        description: items,
        url: `https://github.com/search?q=${encodeURI(args.join('+'))}`,
        author: {
          name: `Page ${page} of ${Math.ceil(data.total_count / 5).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
        },
        footer: {
          text: `Found ${data.total_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} results`,
          icon_url: 'https://www.techcentral.ie/wp-content/uploads/2019/11/GitHub-Mark.png'
        }
      }

      return ({
        send: false,
        result: embed
      })
    } catch (e) {
      return ({
        send: false,
        result: '**Search failed.**'
      })
    }
  }
};