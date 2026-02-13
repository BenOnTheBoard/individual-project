import { AlgorithmBuilder } from '../Algorithm';

export const smManEGSConfig = new AlgorithmBuilder()
  .id('smp-man-egs')
  .name('Stable Marriage Problem')
  .orientation(['Man', 'Woman'])
  .equalGroups(true)
  .algorithm('Extended Gale-Shapley Algorithm')
  .description(
    'The stable marriage problem is the problem of finding a one-to-one stable matching between two equally sized sets of agents: <b>men</b> and <b>women</b>.<br>Here we demonstrate a modified version of the original algorithm which will form the basis of the more complex algorithms on this page.',
  )
  .helpTextMap({
    1: 'Start with no engagements between men and women.',
    2: '%currentAgent% is currently unengaged.',
    3: '%currentAgent% selects %proposee% because she is the most preferred woman remaining on his list.',
    4: 'We check whether %woman% is engaged already.',
    5: '%woman% is engaged to %currentPartner%, so we break the engagement between them.',
    6: '%woman% is not engaged.',
    7: 'We engage %man% and %woman%.',
    8: "We loop over all the men on %woman%'s list whom she prefers %man% to.",
    9: "The next worst man on %woman%'s list is %nextWorstMan%.",
    10: "We remove %nextWorstMan% and %woman% from each other's lists.",
    11: 'All men to whom %woman% prefers %man% have been removed.',
    12: 'We have arrived at a stable matching.',
  })
  .code([
    'Set each person to be free',
    'While some man m is free {',
    "\tw := first woman on m's list",
    '\tIf w is currently engaged {',
    "\t\tBreak engagement between w and w's current partner",
    '\t}',
    '\tProvisionally engage m and w',
    "\tFor each successor m'' of m on w's list {",
    "\t\tm'' is the next worst man on w's preference list",
    "\t\tRemove m'' from w's preference list and vice versa",
    '\t}',
    '}',
  ]);
