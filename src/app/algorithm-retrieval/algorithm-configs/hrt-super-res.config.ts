import { AlgorithmBuilder } from '../Algorithm';

export const hrtSuperResConfig = new AlgorithmBuilder()
  .id('hrt-super-res')
  .name('Hospitals/Residents Problem')
  .orientation(['Resident', 'Hospital'])
  .equalGroups(false)
  .algorithm('Algorithm HRT-Super-Res I.M.S. 2000')
  .description(
    "We extend HR to include the notion of indifference and pursue a many-to-one super-stable matching between a set of <b>hospitals</b> and <b>residents</b><br>Here we demonstrate the algorithm presented in Irving, Manlove, and Scott's 2000 paper.",
  )
  .helpTextMap({
    1: 'Start with no assignments between residents and hospitals.',
    2: '',
    3: '%resident% is currently free',
    4: "We loop over the first non-empty tie on %resident%'s list.",
    5: 'We assign %resident% to %hospital%.',
    6: 'We check whether %hospital% is assigned to more than %capacity% residents.',
    7: "We loop over the last non-empty tie on %hospital%'s list",
    8: 'We check whether %resident% is currently assigned to %hospital%.',
    9: 'They are assigned, so we unassign %resident% and %hospital%.',
    10: "We remove %resident% from %hospitals%'s preference list and vice versa.",
    11: 'We check whether %hospital% is assigned to exactly %capacity% residents.',
    12: 'Since %hospital% has been full at this point, we add it to FULL.',
    13: '%resident% is one of the worst %hospital% is assigned.',
    14: "We loop over residents in ties to the right of %resident% on %hospital%'s list",
    15: "We remove %resident% from %hospitals%'s preference list and vice versa.",
    16: '',
    17: 'Due to %resident%, we can be sure there was no super-stable matching. ',
    18: '',
    19: 'Due to %hospital%, is undersubscribed we can be sure there was no super-stable matching. ',
    20: 'We have a super-stable matching.',
  })
  .code([
    'Set each resident to be free and hospital unsubscribed',
    'The full hospitals list, FULL, is initially empty.',
    'While some resident r is free:',
    "\tFor each hospital h at the head of m's list:",
    '\t\tAssign r and h',
    '\t\tIf h is oversubscribed:',
    "\t\t\tFor each resident s' at the tail of h's list",
    "\t\t\t\tIf s' is currently assigned to h:",
    "\t\t\t\t\tBreak assignment between s' and h",
    "\t\t\t\tDelete the pair (s', h)",
    '\t\tIf h is full: ',
    '\t\t\tAdd h to FULL',
    '\t\t\ts := worst resident assigned to h',
    "\t\t\tFor each strict succesor s' of s on h's list",
    '\t\t\t\tDelete the pair (s, h)',
    'If some resident is multiply assigned:',
    "\tReturn 'no super-stable matching'",
    'If some hospital in FULL is now undersubscribed:',
    "\tReturn 'no super-stable matching'",
    'Return this matching as super-stable',
  ]);
