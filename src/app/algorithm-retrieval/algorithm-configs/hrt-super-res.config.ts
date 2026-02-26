import { AlgorithmBuilder } from '../Algorithm';

export const hrtSuperResConfig = new AlgorithmBuilder()
  .id('hrt-super-res')
  .name('Hospitals/Residents Problem')
  .orientation(['Resident', 'Hospital'])
  .equalGroups(false)
  .algorithm('Algorithm HRT-Super-Res I.M.S. 2000')
  .description(
    "We extend HR to include the notion of indifference and pursue a many-to-one super-stable matching between a set of <b>hospitals</b> and <b>residents</b><br>Here we demonstrate the algorithm presented in Irving, Manlove, and Scott's 2000 paper.",
  );
