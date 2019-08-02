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
    p.score = 0
    return p
  })

  const takeAndSort = firstEligible => {
    if (!firstEligible) return 'EMPTY'

    rotas['2i 1'].push(firstEligible.Name)
    firstEligible.score += 1 / parseFloat(firstEligible.FTE)
    allPeople = allPeople.sort((a, b) => a.score - b.score) //TODO fix external mutation

    return firstEligible.Name
  }

  const output = dates.map(day => {
    const today = [day]

    const eligible2i1 = allPeople.filter(person =>
      person['2i'] === 'Yes' &&
      person[day] !== 'Out'
    )

    today.push(takeAndSort(eligible2i1[0]))

    // allPeople.splice(allPeople.findIndex(({ Name }) => Name === eligible2i1[0].Name), 1)
    // allPeople.push(eligible2i1[0])

    const eligible2i2 = allPeople.filter(person =>
      person['2i'] === 'Yes' &&
      person[day] !== 'Out' &&
      person.Team !== eligible2i1[0].Team
    )

    today.push(takeAndSort(eligible2i2[0]))

    // allPeople.splice(allPeople.findIndex(({ Name }) => Name === eligible2i2[0].Name), 1)
    // allPeople.push(eligible2i2[0])

    const eligibleCR = allPeople.filter(person =>
      person['CR'] === 'Yes' &&
      person[day] !== 'Out'
    )

    today.push(takeAndSort(eligibleCR[0]))

    // allPeople.splice(allPeople.findIndex(({ Name }) => Name === eligibleCR[0].Name), 1)
    // allPeople.push(eligibleCR[0])

    const eligible2ndLine = allPeople.filter(person =>
      person['2nd Line'] === 'Yes' &&
      person[day] !== 'Out'
    )

    today.push(takeAndSort(eligible2ndLine[0]))

    // allPeople.splice(allPeople.findIndex(({ Name }) => Name === eligible2ndLine[0].Name), 1)
    // allPeople.push(eligible2ndLine[0])

    const eligible2ndLine2 = allPeople.filter(person =>
      person['2nd Line'] === 'Yes' &&
      person[day] !== 'Out' &&
      person.Team !== eligible2ndLine[0].Team
    )

    today.push(takeAndSort(eligible2ndLine2[0]))

    // allPeople.splice(allPeople.findIndex(({ Name }) => Name === eligible2ndLine2[0].Name), 1)
    // allPeople.push(eligible2ndLine2[0])

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
