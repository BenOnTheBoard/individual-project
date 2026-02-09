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
  .code([
    'Set each person to be free',
    'Do {',
    '\tWhile some man m is free {',
    "\t\tFor each woman w at the head of m's list {",
    "\t\t\tProvisionally engage m and w'",
    "\t\t\tFor each successor m' of m on w's list {",
    "\t\t\t\tIf m' is currently engaged to w {",
    "\t\t\t\t\tBreak engagement between m' and w",
    '\t\t\t\t}',
    "\t\t\t\tRemove m' from w's preference list and vice versa",
    '\t\t\t}',
    '\t\t}',
    '\t}',
    '\tFor each womwan w who is multiply engaged {',
    '\t\tBreak all engagements involving w',
    "\t\tFor each m at the tail of w's preference list {",
    "\t\t\tRemove m from w's preference list and vice versa",
    '\t\t}',
    '\t}',
    "} until (some man's preference list is empty) or (everyone is engaged)",
    'If everyone is engaged {',
    '\tReturn this matching as super-stable',
    '} else {',
    "\tReturn 'no super-stable matching'",
    '}',
  ]);
