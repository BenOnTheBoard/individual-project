import { AlgorithmBuilder } from '../Algorithm';

export const smtSuperManConfig = new AlgorithmBuilder()
  .id('smt-super-man')
  .name('Stable Marriage Problem')
  .orientation(['Man', 'Woman'])
  .equalGroups(true)
  .algorithm('Algorithm SUPER Irving 1994')
  .description(
    "We extend SM to include the notion of indifference and pursue a super-stable matching between two equally sized sets of agents: <b>men</b> and <b>women</b>.<br>Here we demonstrate the algorithm presented in Irving's 1994 paper. For the case with incomplete lists, see Manlove's 1999 Stable Marriage with Ties and Unacceptable Partners",
  )
  .helpTextMap({
    1: 'Start with no assignments between men and women.',
    2: '',
    3: '%man% is currently unassigned.',
    4: "We loop over the first non-empty tie in %man%'s list.",
    5: 'We assign %man% to %woman%.',
    6: "We loop over men strictly worse than %man% on %woman%'s list.",
    7: 'We check whether %man% is currently assigned to %woman%.',
    8: 'They are assigned, so we unassign %man% and %woman%.',
    9: "Remove %man% from %woman%'s preference list and vice versa.",
    10: '%woman% is assigned to more than one man.',
    11: '',
    12: "Remove %man% from %woman%'s preference list and vice versa.",
    13: "We loop over the last non-empty tie in %woman%'s list.",
    14: "Remove m from w's preference list and vice versa.",
    15: 'We end the algorithm if and some if no man is free.',
    16: 'We check if everyone is engaged.',
    17: 'We do have a super-stable matching.',
    18: 'We can be sure there was no super-stable matching.',
  })
  .code([
    'Set each person to be free',
    'Do:',
    '\tWhile some man m is free:',
    "\t\tFor each woman w at the head of m's list:",
    '\t\t\tProvisionally assign m and w',
    "\t\t\tFor each strict successor m' of m on w's list:",
    "\t\t\t\tIf m' is currently assigned to w:",
    "\t\t\t\t\tBreak assignment between m' and w",
    "\t\t\t\tDelete the pair (m', w)",
    '\tFor each woman w who is multiply assigned:',
    "\t\tFor m' assigned to w:",
    "\t\t\tBreak assignment between m' and w",
    "\t\tFor each m at the tail of w's preference list:",
    '\t\t\tDelete the pair (m, w)',
    "Until (some man's list is empty) or (everyone is assigned)",
    'If everyone is assigned:',
    '\tReturn this matching as super-stable',
    "Return 'no super-stable matching'",
  ]);
