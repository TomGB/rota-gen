const csv = require('csvtojson')

const csvFilePath = 'sheet.csv'

const run = async () => {
  const rotas = {
    '2i 1': [],
    '2i 2': [],
    'CR': [],
    '2nd Line 1': [],
    '2nd Line 2': [],
  }

  const ppl = await csv().fromFile(csvFilePath)

  const people = ppl.slice(0)

  const dates = Object.keys(ppl[0]).filter((a, i) => i > 8)

  let allPeople = ppl.map(p => {
    p.optimalDays = []
    p.nextDay = 0
    p.numDaysAvailable = dates.filter(day => p[day] !== 'Out').length
    return p
  })

  const numberOfRotas = Object.keys(rotas).length
  const numberOfPeople = allPeople.length
  const numberOfDays = dates.length

  const availablePeople = allPeople.reduce((acc, person) => {
    if (person['2i'] === 'Yes') acc['2i 1'].push(person)
    if (person['2i'] === 'Yes') acc['2i 2'].push(person)
    if (person['CR'] === 'Yes') acc['CR'].push(person)
    if (person['2nd Line'] === 'Yes') acc['2nd Line 1'].push(person)
    if (person['2nd Line'] === 'Yes') acc['2nd Line 2'].push(person)
    return acc
  }, Object.assign({}, rotas))

  const daysPerPersonPerRota = {
    '2i 1': numberOfDays / availablePeople['2i 1'].length,
    '2i 2': numberOfDays / availablePeople['2i 2'].length,
    'CR': numberOfDays / availablePeople['CR'].length,
    '2nd Line 1': numberOfDays / availablePeople['2nd Line 1'].length,
    '2nd Line 2': numberOfDays / availablePeople['2nd Line 2'].length,
  }

  const totalNumDaysAvailablePerRota = {
    '2i 1': availablePeople['2i 1'].reduce((acc, person) => acc + person.numDaysAvailable, 0),
    '2i 2': availablePeople['2i 2'].reduce((acc, person) => acc + person.numDaysAvailable, 0),
    'CR': availablePeople['CR'].reduce((acc, person) => acc + person.numDaysAvailable, 0),
    '2nd Line 1': availablePeople['2nd Line 1'].reduce((acc, person) => acc + person.numDaysAvailable, 0),
    '2nd Line 2': availablePeople['2nd Line 2'].reduce((acc, person) => acc + person.numDaysAvailable, 0),
  }

  console.log('numberOfDays', numberOfDays)
  console.log('daysPerPersonPerRota', daysPerPersonPerRota)

  const takeAndSort = firstEligible => {
    if (!firstEligible) return 'EMPTY'

    rotas['2i 1'].push(firstEligible.Name)
    firstEligible.score += 1 / parseFloat(firstEligible.FTE)
    // allPeople = allPeople.sort((a, b) => a.score - b.score) //TODO fix external mutation

    allPeople.splice(allPeople.findIndex(({ Name }) => Name === firstEligible.Name), 1)
    allPeople.push(firstEligible)

    return firstEligible.Name
  }

  const output = dates.map(day => {
    const today = [day]

    const eligible2i1 = allPeople.filter(person =>
      person['2i'] === 'Yes' &&
      person[day] !== 'Out'
    )

    today.push(takeAndSort(eligible2i1[0]))

    const eligible2i2 = allPeople.filter(person =>
      person['2i'] === 'Yes' &&
      person[day] !== 'Out' &&
      person.Team !== eligible2i1[0].Team
    )

    today.push(takeAndSort(eligible2i2[0]))

    const eligibleCR = allPeople.filter(person =>
      person['CR'] === 'Yes' &&
      person[day] !== 'Out'
    )

    today.push(takeAndSort(eligibleCR[0]))

    const eligible2ndLine = allPeople.filter(person =>
      person['2nd Line'] === 'Yes' &&
      person[day] !== 'Out'
    )

    today.push(takeAndSort(eligible2ndLine[0]))

    const eligible2ndLine2 = allPeople.filter(person =>
      person['2nd Line'] === 'Yes' &&
      person[day] !== 'Out' &&
      person.Team !== eligible2ndLine[0].Team
    )

    today.push(takeAndSort(eligible2ndLine2[0]))

    return today
  })

  console.log(output.map(d => d.join(',')).join('\n'))

  const count = people.map(person => {
    const bigList = output.reduce((acc, x) => acc.concat(x), []);

    return {
      count: bigList.filter(name => name === person.Name).length,
      name: person.Name,
      FTE: person.FTE === '0.8',
    }
  })

  console.log(count)
}

run()
