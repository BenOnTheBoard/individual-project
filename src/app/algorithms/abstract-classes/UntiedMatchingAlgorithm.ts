import { UntiedAgent, Group } from '../interfaces/Agents';
import { MatchingAlgorithm } from './MatchingAlgorithm';

export abstract class UntiedMatchingAlgorithm extends MatchingAlgorithm {
  protected group1Agents: Map<String, UntiedAgent>;
  protected group2Agents: Map<String, UntiedAgent>;

  protected origPrefsG1: Map<String, Array<String>>;
  protected origPrefsG2: Map<String, Array<String>>;

  copyOriginalPrefs(group: Group): Map<String, Array<String>> {
    const agents = group == 'group1' ? this.group1Agents : this.group2Agents;
    return new Map(
      Array.from(agents.values()).map((agent) => [
        agent.name,
        agent.ranking.map((a) => a.name),
      ]),
    );
  }

  initCurrentAndOriginalPrefs() {
    this.styledPrefsG1 = this.getRankings(this.group1Agents);
    this.origPrefsG1 = this.copyOriginalPrefs('group1');
    if (this.group2Agents) {
      this.styledPrefsG2 = this.getRankings(this.group2Agents);
      this.origPrefsG2 = this.copyOriginalPrefs('group2');
    }
  }

  generateRandomRankings(
    rankers: Map<String, UntiedAgent>,
    targets: Map<String, UntiedAgent>,
  ): void {
    for (const agent of Array.from(rankers.values())) {
      const shuffledTargets = Array.from(targets.values());
      this.utils.shuffle(shuffledTargets);
      agent.ranking = shuffledTargets;
    }
  }

  getRankings(agentMap: Map<String, UntiedAgent>): Map<String, Array<String>> {
    return new Map(
      Array.from(agentMap.values()).map((agent) => [
        this.utils.getAsChar(agent),
        agent.ranking.map((m) => this.utils.getAsChar(m)),
      ]),
    );
  }

  getRank(agent: UntiedAgent, target: UntiedAgent): number {
    return agent.ranking.findIndex(
      (candidate) => candidate.name == target.name,
    );
  }

  getOriginalRank(
    agent: UntiedAgent,
    target: UntiedAgent,
    group: Group,
  ): number {
    const origPrefs = group == 'group1' ? this.origPrefsG1 : this.origPrefsG2;
    return origPrefs.get(agent.name).indexOf(target.name);
  }

  packageCurrentPrefs(group: Group): Map<String, Array<String>> {
    const currentPrefs =
      group == 'group1' ? this.styledPrefsG1 : this.styledPrefsG2;
    return structuredClone(currentPrefs);
  }

  stylePrefs(
    group: Group,
    agent: UntiedAgent,
    target: UntiedAgent,
    colour: string,
  ): void {
    const idx = this.getOriginalRank(agent, target, group);
    const prefLists =
      group == 'group1' ? this.styledPrefsG1 : this.styledPrefsG2;
    const agentChar = this.utils.getAsChar(agent);
    const prefs = prefLists.get(agentChar);
    const currentToken = prefs[idx];
    const nameIdx = currentToken.includes('#')
      ? currentToken.length - 2 // there's an extra closing bracket
      : currentToken.length - 1;
    const currentAgent = currentToken.charAt(nameIdx);
    const colourHex = this.colourHexService.getHex(colour);
    prefs[idx] = `{${colourHex}${currentAgent}}`;
  }
}
