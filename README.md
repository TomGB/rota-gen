# rota-gen

## Notes

I think I have a solution which uses an 'optimal day' approach
although it is tricky when you have multiple rotas and people who can do more than one rota

e.g.
`(num rota days * ( num bob avail / sum(num avail)) * (n ppl / num rota days) * n ppl = frequency of days`
so given 2 ppl one with 20 days of availability and one with 15:
`(20 * (20 / (20 + 15))) * (2/20) * 2 = every 2.28 days`

`(20 * (15 / (20 + 15))) * (2/20) * 2 = every 1.7 days`

notice the person with the 5 days holiday (the second) is on shift more often


Then separately the FTE can be done:
`bob = (num rota days / (n ppl * sum(all FTE) )* bob FTEac = num of bob's days`
