export const unfoldQueries = (query: any) => {
  const prefix = 'teetrack_'
  const sepValues = '|'
  const sepPairs = ':'
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const queryTracksRaw = Object.fromEntries(Object.entries(query).filter(([key]) => key.startsWith(prefix)))
  // console.log('utils > navigation > unfoldQueries > queryTracksRaw :', queryTracksRaw)

  const queryTracks = Object.keys(queryTracksRaw)
  // console.log('utils > navigation > unfoldQueries > queryTracks :', queryTracks)

  const tracksArray: any[] = queryTracks.map((key) => {
    const trackId = key.replace(prefix, '')
    const obj = {
      id: trackId,
      step: '',
      selected: []
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
    const strParts = query[key].split(sepValues)
    // console.log('utils > navigation > unfoldQueries > strParts :', strParts)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
    const pairs = strParts.map((i: any) => {
      const o: any = {}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
      const split = i.split(sepPairs)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (split[0].length) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        o[split[0]] = split[1]
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return o
      }
    })
    // console.log('utils > navigation > unfoldQueries > pairs :', pairs)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
    obj.selected = pairs.filter((i: any) => !!i)
    return obj
  })
  // console.log('utils > navigation > unfoldQueries > tracksArray :', tracksArray)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return tracksArray
}
