import { AlgorithmBuilder } from '../Algorithm';

export const hrResidentConfig = new AlgorithmBuilder()
  .id('hr-resident-egs')
  .name('Hospitals/Residents Problem')
  .orientation(['Resident', 'Hospital'])
  .equalGroups(false)
  .algorithm('Capacitated Extended Gale-Shapley Algorithm')
  .description(
    'The Hospitals/Residents Problem is the problem of finding a many-to-one stable matching between a set of <b>hospitals</b> and <b>residents</b>, where a hospital can be assigned multiple residents up to some capacity.',
  )
  .helpTextMap({
    1: 'Start with no assignments between residents and hospitals.',
    2: "%resident% is the next resident who doesn't have a hospital and still has some hospitals in their preference list.",
    3: '%resident% selects %hospital%, the first hospital left on its list.',
    4: 'We check whether %hospital% is currently full. If not, we provisionally assign %resident% to %hospital%.',
    5: "%hospital%'s number of residents is equal to its max capacity, so choose the worst resident assigned to %hospital% (%resident%).",
    6: 'We unassign %hospital% and %resident%.',
    7: 'Assign %resident% to %hospital%.',
    8: 'We check whether %hospital% is full after assigning %resident% to %hospital%.',
    9: "%hospital% is fully subscribed, so we choose the worst resident assigned to them (%resident%) and remove each successor from %hospital%'s preference list.",
    10: '%hospital% selects %resident% as the next resident to be removed from its list.',
    11: "We remove %resident% from %hospital%'s list.",
    12: 'We have arrived at a stable matching.',
  })
  .code([
    'Set each hospital and resident to be free',
    'While (some resident r is free) and (r has a nonempty list):',
    "\th := first hospital on r's list",
    '\tIf h is fully subscribed then:',
    "\t\tr' := worst resident provisionally assigned to h",
    "\t\tAssign r' to be free (clear match)",
    '\tAssign r to h',
    '\tIf h is fully subscribed then:',
    '\t\ts := worst resident provisionally assigned to h',
    "\t\tFor each successor s' of s on h's list:",
    "\t\t\tRemove s' and h from each other's lists",
    'The current set of assignments is stable',
  ]);
