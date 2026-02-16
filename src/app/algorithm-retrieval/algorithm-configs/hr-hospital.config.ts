import { AlgorithmBuilder } from '../Algorithm';

export const hrHospitalConfig = new AlgorithmBuilder()
  .id('hr-hospital-egs')
  .name('Hospitals/Residents Problem')
  .orientation(['Hospital', 'Resident'])
  .equalGroups(false)
  .algorithm('Capacitated Extended Gale-Shapley Algorithm')
  .description(
    'The Hospitals/Residents Problem is the problem of finding a many-to-one stable matching between a set of <b>hospitals</b> and <b>residents</b>, where a hospital can be assigned multiple residents up to some capacity.',
  )
  .helpTextMap({
    1: 'Start with no assignments between residents and hospitals.',
    2: '%hospital% is undersubscribed and has a resident on their preference list that is not assigned to them.',
    3: '%hospital% selects %resident%, the best resident on its preference list.',
    4: 'We check whether %resident% is assigned to another hospital.',
    5: 'We unassign %resident% and %hospital% from each other.',
    6: 'We assign %resident% and %hospital% to each other.',
    7: "We loop over each hospital h' which %resident% prefers %hospital% to on %resident%'s preference list.",
    8: "We remove %resident% AND %hospital% from each other's list.",
    9: 'We have arrived at a stable matching.',
  })
  .code([
    'Set each hospital and resident to be free',
    'While some hospital h is undersubscribed, and has a non-empty preference list:',
    "\tr := first resident on h's preference list not assigned to h",
    "\tIf r is assigned to another hospital h':",
    "\t\tUnassign r and h'",
    '\tProvisionally assign r to h',
    "\tFor each successor h' of h on r's list:",
    "\t\tRemove h' and r from each others preference list",
    'The current set of assignments is stable',
  ]);
