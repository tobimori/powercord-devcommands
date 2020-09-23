const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{4})$/g

module.exports = {
  command: 'base64',
  description: 'Encode and decode Base64 strings',
  usage: '{c} <base64/text to be encoded in base64>',
  executor: (args) => {
    if (args.length === 0) return ({
      send: false,
      result: '**No query provided!**'
    })

    if (args.join(' ').match(base64Regex)) {
      try {
        return ({
          send: false,
          result: `**Your decoded string is:**\n\`\`\`${atob(args.join(' '))}\`\`\``
        })
      } catch (e) {
        console.error(e)

        return ({
          send: false,
          result: `**Failed to decode Base64!**`
        })
      }
    } else {
      try {
        return ({
          send: false,
          result: `**Your encoded string is:**\n\`\`\`${btoa(args.join(' '))}\`\`\``
        })
      } catch (e) {
        console.error(e)

        return ({
          send: false,
          result: `**Failed to encode Base64!**`
        })
      }

    }
  }
};