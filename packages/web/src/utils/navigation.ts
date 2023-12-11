// CONSOLE LOG TEMPLATE
// console.log(`utils.navigation > FUNCTION_NAME > MSG_OR_VALUE :`)

export const unfoldQueries = (query: any) => {
  const prefix = 'teetrack_'
  const sepValues = '|'
  const sepPairs = ':'
  const queryTracksRaw = Object.fromEntries(Object.entries(query)
    .filter(([key]) => key.startsWith(prefix))
  )

  const queryTracks = Object.keys(queryTracksRaw)

  const tracksArray: any[] = queryTracks.map(key => {
    const trackId = key.replace(prefix, '')
    const obj = {
      id: trackId,
      step: '',
      selected: []
    }
    const strParts = query[key].split(sepValues)
    const pairs = strParts.map((i: any) => {
      const o: any = {}
      const split = i.split(sepPairs)
      if (split[0].length) {
        o[split[0]] = split[1]
        return o
      }
    })
    obj.selected = pairs.filter((i: any) => !!i)
    return obj
  })
  return tracksArray
}
