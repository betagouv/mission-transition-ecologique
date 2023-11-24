export const unfoldQueries = (query: any) => {
  const prefix = 'teetrack_'
  const sepValues = '|'
  const sepPairs = ':'
  const queryTracksRaw = Object.fromEntries(Object.entries(query)
    .filter(([key]) => key.startsWith(prefix))
  )
  // console.log('utils > navigation > unfoldQueries > queryTracksRaw :', queryTracksRaw)

  const queryTracks = Object.keys(queryTracksRaw)
  // console.log('utils > navigation > unfoldQueries > queryTracks :', queryTracks)

  const tracksArray: any[] = queryTracks.map(key => {
    const trackId = key.replace(prefix, '')
    const obj = {
      id: trackId,
      step: '',
      selected: []
    }
    const strParts = query[key].split(sepValues)
    // console.log('utils > navigation > unfoldQueries > strParts :', strParts)
    const pairs = strParts.map((i: any) => {
      const o: any = {}
      const split = i.split(sepPairs)
      if (split[0].length) {
        o[split[0]] = split[1]
        return o
      }
    })
    // console.log('utils > navigation > unfoldQueries > pairs :', pairs)
    obj.selected = pairs.filter((i: any) => !!i)
    return obj
  })
  // console.log('utils > navigation > unfoldQueries > tracksArray :', tracksArray)
  return tracksArray
}
