import { AlgorithmBuilder } from '../Algorithm';

export const smManGSConfig = new AlgorithmBuilder()
  .id('smp-man-gs')
  .name('Stable Marriage Problem')
  .orientation(['Man', 'Woman'])
  .equalGroups(true)
  .algorithm('Gale-Shapley Algorithm')
  .description(
    'The stable marriage problem is the problem of finding a one-to-one stable matching between two equally sized sets of agents: <b>men</b> and <b>women</b>.<br>Here we demonstrate the original Gale-Shapley algorithm.',
  )
  .helpTextMap({
    1: 'Start with no matches between men and women.',
    2: '%man% is currently unmatched.',
    3: '%man% selects %woman%, the next most preferred woman whom he has not yet proposed to.',
    4: 'We check whether %woman% has a match already.',
    5: '%woman% is free; match her with %man%.',
    6: '%woman% is currently matched to %match%, so we must compare %match% to %man%.',
    7: 'We check whether %woman% prefers %match% to %man%.',
    8: '%woman% prefers %man% to %match% so we free up %match% and assign %woman% to %man%.',
    9: '%woman% prefers %match% to %man%.',
    10: "We don't change the matching.",
    11: 'We have arrived at a stable matching.',
  })
  .code([
    'Set each person to be free',
    'While some man m is free do:',
    "\tw := next most preferred woman on m\'s list",
    '\tIf w is free then:',
    '\t\tAssign m to w',
    '\tElse:',
    "\t\tIf w prefers m to her current partner m\' then:",
    "\t\t\tAssign m to w and set m\' to be free",
    '\t\tElse:',
    "\t\t\tw rejects m and remains with m\'",
    'The current set of assignments is stable',
  ]);
