import { AlgorithmBuilder } from '../Algorithm';

export const srPersonConfig = new AlgorithmBuilder()
  .id('smp-room-irv')
  .name('Stable Roommates Problem')
  .orientation(['Person', 'Person'])
  .equalGroups(true)
  .algorithm("Irving's Algorithm")
  .description(
    'The stable roommates problem is the problem of finding a one-to-one stable matching amongst a single set of agents, which we thus refer to neutrally as <b>people</b>.<br>We demonstrate the algorithm due to Robert W. Irving.',
  )
  .helpTextMap({
    1: 'Start with no assignments amongst people.',
    2: '%person% is not assigned to anyone.',
    3: "We check whether %person%'s preference list is empty.",
    4: 'Any empty list indicates that the instance has no stable matchings.',
    5: '%person% selects %selected%, the first person left on their preference list.',
    6: 'We set %person% to be assigned to %selected%.',
    7: 'We check whether another person than %person% is assigned to %selected%.',
    8: 'If they are, then unassign them. unassign %old_person% from %selected%.',
    9: 'We loop over each person %selected% prefers %person% to.',
    10: "We remove %removee% from %person% from each other's lists.",
    11: '%person% has more than one person left in their preference list.',
    12: "We look for rotations within %person%'s preference list, that is a cycle of ordered pairs through preference lists.",
    13: 'If we can find a rotation...', //%rotation%
    14: "We delete pairs in rotation, removing %removee% from %person% from each other's lists.",
    15: 'We check whether any person has a preference list of length one.',
    16: 'We assign %person% to %preference%, the last person in their preference list.',
    17: "We check whether %person%'s preference list is empty.",
    18: 'Any empty list indicates that the instance has no stable matchings.',
    19: 'We have arrived at a stable matching.',
  })
  .code([
    'Set each person to be free',
    'While some person p is free:',
    '\tIf person p has an empty preference list:',
    '\t\tEnd - no stable matching',
    "\tperson b := first preference on p's list",
    '\tAssign p to b',
    '\tIf any person c is assigned to person b:',
    '\t\tFree up person c',
    '\tFor each person c that b prefers p to:',
    "\t\tRemove c from p's list and remove p from c's list",
    'While some person p has more than one person left in their preference list',
    "Look for rotations in person p's preference list",
    'If rotation r is found:',
    '\tDelete pairs in rotation r',
    '\tIf there is a person b with a preference of length one:',
    '\t\tperson b := last preference',
    'If any people have empty preference lists:',
    '\tEnd - no stable matching',
    'The current set of assignments is stable',
  ]);
