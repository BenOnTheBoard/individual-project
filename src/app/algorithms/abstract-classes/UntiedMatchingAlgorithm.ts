import { Agent, Group } from '../interfaces/Agents';
import { MatchingAlgorithm } from './MatchingAlgorithm';

export abstract class UntiedMatchingAlgorithm extends MatchingAlgorithm {
  protected abstract group1Agents: Map<String, Agent>;
  protected abstract group2Agents: Map<String, Agent>;

  protected originalPrefsGroup1: Map<String, Array<String>>;
  protected originalPrefsGroup2: Map<String, Array<String>>;

  initCurrentAndOriginalPrefs() {
    this.currentPrefsGroup1 = this.getRankings(this.group1Agents);
    this.originalPrefsGroup1 = structuredClone(this.currentPrefsGroup1);
    if (this.group2Agents) {
      this.currentPrefsGroup2 = this.getRankings(this.group2Agents);
      this.originalPrefsGroup2 = structuredClone(this.currentPrefsGroup2);
    }
  }

  generateRandomRankings(
    rankers: Map<String, Agent>,
    targets: Map<String, Agent>,
  ): void {
    for (const agent of Array.from(rankers.values())) {
      const shuffledTargets = Array.from(targets.values());
      this.utils.shuffle(shuffledTargets);
      agent.ranking = shuffledTargets;
    }
  }

  getRankings(agentMap: Map<String, Agent>): Map<String, Array<String>> {
    return new Map(
      Array.from(agentMap.values()).map((agent) => [
        this.utils.getAsChar(agent),
        agent.ranking.map((m) => this.utils.getAsChar(m)),
      ]),
    );
  }

  getRank(agent: Agent, target: Agent): number {
    return agent.ranking.findIndex(
      (candidate) => candidate.name == target.name,
    );
  }

  getOriginalRank(agent: Agent, target: Agent, group: Group): number {
    const originalPrefs =
      group == 'group1' ? this.originalPrefsGroup1 : this.originalPrefsGroup2;
    const currentChar = this.utils.getAsChar(agent);
    const targetChar = this.utils.getAsChar(target);
    return originalPrefs.get(currentChar).indexOf(targetChar);
  }

  packageCurrentPrefs(group: Group): Map<String, Array<String>> {
    const currentPrefs =
      group == 'group1' ? this.currentPrefsGroup1 : this.currentPrefsGroup2;
    return structuredClone(currentPrefs);
  }

  stylePrefs(group: Group, agent: Agent, target: Agent, colour: string): void {
    const idx = this.getOriginalRank(agent, target, group);
    const prefLists =
      group == 'group1' ? this.currentPrefsGroup1 : this.currentPrefsGroup2;
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
