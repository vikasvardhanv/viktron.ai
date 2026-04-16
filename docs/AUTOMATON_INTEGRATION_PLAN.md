# Automaton Integration Plan for Viktron

## Current Viktron Agent Architecture

### How Agents Are Created
```
Workspace (per-workspace filesystem) 
    ↓
Task Request → /api/agent/execute or /api/agent/tasks
    ↓
enqueueTask() → TaskQueue (Postgres or in-memory)
    ↓
Agent Executor selects capability based on request signals
```

**Creation Flow:**
1. User submits request via HTTP API or Slack
2. Request is enqueued in TaskQueue with workspace context
3. Worker picks up task and routes to appropriate capability
4. Agent executes and returns result

### How Agents Work

**LightAgent Architecture (Current):**
```
Planner → Intent detection, decomposition, route selection
    ↓
Memory → Persistent workspace memory with retrieval/writeback
    ↓
Tools → Tool registry, capability-aware routing
    ↓
Reflection → Branch generation, score-based selection
    ↓
Execution → Browser, API, or Workspace routes
```

**Route Selection (Intelligent Orchestration):**
- **Browser-first**: Website interaction, scraping, form filling, login flows
- **API-first**: Data-driven tasks, scheduling, research via modal services
- **Workspace-first**: Code execution, engineering, shell scripts

**Available Capabilities:**
1. Analytics & reporting
2. Proactive automation (scheduled tasks)
3. Research & intelligence
4. Lead research (scraping)
5. Form filling
6. Scheduling (with Twilio integration)
7. Browser automation (via Browser Use API)
8. Code & engineering (repo-aware, git workflows)
9. Shell workspace (persistent per-workspace Linux)
10. App building (specification generation)

### How They Spawn

**Current Spawning Mechanism:** ✅ CAPABILITY-BASED ROUTING (Agents DO Spawn)
- **Multi-agent coordination**: Different agents selected based on request type
- **Task queue orchestration**: PostgreSQL `agent_tasks` + `agent_task_events` tables
- **Worker pool dispatch**: Worker process polls queue and routes to appropriate agent
- **Capability-based spawning**: 11 different capabilities → 6+ agents
- **Agents coordinating**: Lead Agent, Scheduling Agent, Email Tracker, Demo Agent, Browser Runtime, Google GenAI

**Distributed Agent Ecosystem:**
1. **Lead Agent** (Modal) - Prospect research, scraping, list cleaning
2. **Scheduling Agent** (Modal) - Appointment booking, availability checking
3. **Email Tracker Agent** (Modal) - Campaign tracking, open/click monitoring
4. **Demo Agent** (Modal) - On-demand demo creation
5. **Browser Runtime** (Internal) - Web scraping, form filling, navigation
6. **Google GenAI** (LLM) - Research, analysis, planning, reasoning

**Memory Persistence:**
- PostgreSQL-backed task queue (not file-based)
- Event sourcing via `agent_task_events` table
- Persistent per-workspace memory search/retrieval
- Skills, tools, and schedules are workspace-scoped
- Full audit trail of all agent actions

**Integration Points:**
- **Slack events** → Task enqueued → Worker routes to agent → Result posted to Slack
- **HTTP API** → Direct task submission → Queue → Agent dispatch → Response
- **Scheduled tasks** → Cron-like execution via schedulerService
- **Modal services** → External agents (Lead Agent, Scheduling endpoints, Email Tracker, Demo Agent)
- **Browser Runtime** → Complex web tasks (scraping, forms, navigation)

---

## How Automaton Enhances Viktron

### 1. **Agent Autonomy Loop** ✅
**Current**: Sequential request → execute → result

**Automaton Addition**: Think → Act → Observe → Reflect → Decide
```javascript
// Automaton-inspired autonomous loop
const autonomousLoop = async (agent) => {
  while (agent.isAlive) {
    const observation = await agent.perceiveEnvironment(); // Observe
    const thought = await agent.think(observation);         // Think
    const action = await agent.decideAction(thought);       // Decide
    const result = await agent.act(action);                 // Act
    await agent.recordMemory(observation, action, result);  // Remember
  }
};
```

### 2. **Agent Spawning & Replication** ✅
**Current**: Static agent per workspace

**Automaton Addition**: CEO Agent can spawn specialized child agents
```javascript
// Example: CEO Agent spawns Sales + Support + Content agents
const ceoAgent = {
  spawn: async (specialization) => {
    const childAgent = {
      id: generateUUID(),
      parent_id: ceoAgent.id,
      specialization: specialization,  // 'sales', 'support', 'content'
      workspace: ceoAgent.workspace,
      memory: inheritParentMemory(),
      capabilities: specializeCapabilities(specialization),
    };
    return registerAgent(childAgent);
  },
};
```

### 3. **Self-Modification & Learning** ✅
**Current**: Static skills and prompts

**Automaton Addition**: Agents refine their own prompts based on results
```javascript
// Agent learns from success/failure
const learnFromExecution = async (agent, result) => {
  if (result.success) {
    const improvement = extractSuccessPattern(result);
    agent.skills.update(result.capability, improvement);
    agent.memory.record('success_pattern', improvement);
  } else {
    const correction = identifyFailureCause(result);
    agent.prompts.refine(result.capability, correction);
    agent.memory.record('failure_correction', correction);
  }
};
```

### 4. **Modular Skill System** ✅
**Current**: Skills are static JSON objects

**Automaton Addition**: Skills are executable, versioned, and can be installed dynamically
```javascript
// Automaton-style skill installation
const skill = {
  key: 'competitive_analysis',
  name: 'Competitive Analysis',
  version: '1.2.3',
  entrypoint: 'execute',
  dependencies: ['research_intelligence', 'browser_automation'],
  install: async () => {
    // Can modify system behavior at runtime
    return registerSkill(this);
  },
  execute: async (request, payload) => {
    // Skill performs work
  },
  uninstall: async () => {
    // Clean exit
  },
};

agent.skills.install(skill);
```

### 5. **Persistence & State Management** ✅
**Current**: File-backed memory (local filesystem)

**Automaton Addition**: Blockchain-inspired audit log + distributed state
```javascript
// SQLite + event sourcing
const agentState = {
  agent_id: 'uuid',
  version: 5,
  created_at: timestamp,
  events: [
    { type: 'spawned', data: {...}, timestamp },
    { type: 'task_completed', result: {...}, timestamp },
    { type: 'skill_installed', skill: 'competitive_analysis', timestamp },
    { type: 'memory_updated', content: {...}, timestamp },
  ],
  // Can replay events to reconstruct state
};
```

### 6. **Resilience Through Replication** ✅
**Current**: Single execution chain (if worker crashes, task fails)

**Automaton Addition**: Agent replication for fault tolerance
```javascript
// If agent crashes, sibling can take over
const replicationStrategy = {
  replicate: async (agent) => {
    const replica = clone(agent);
    replica.id = generateUUID();
    replica.role = 'replica';
    replica.primary_id = agent.id;
    return registerAgent(replica);
  },
};
```

---

## Integration Roadmap

### **Phase 1: Autonomous Execution Loop** (Week 1-2)
- [ ] Implement Automaton's Think→Act→Observe→Reflect loop
- [ ] Update agentExecutor.js with reflection capability
- [ ] Add recordOrchestrationMemory() calls after each task
- [ ] Test with scheduled tasks (already have schedulerService)

**Files to modify:**
- `server/utils/agentExecutor.js` - Add reflection phase
- `server/utils/orchestrationEngine.js` - Add feedback loop
- `server/utils/stateStore.js` - Enhanced memory structure

### **Phase 2: Agent Spawning & Hierarchy** (Week 2-3)
- [ ] Implement CEO Agent spawning logic
- [ ] Create agent registry (agents table in DB)
- [ ] Support parent→child communication channels
- [ ] Add capability inheritance/specialization

**Files to create:**
- `server/utils/agentRegistry.js` - Agent lifecycle management
- `server/routes/agents.js` - Agent CRUD operations
- `server/models/Agent.js` - Agent schema

### **Phase 3: Self-Modification & Learning** (Week 3-4)
- [ ] Implement skill versioning
- [ ] Add prompt optimization based on outcomes
- [ ] Create skill dependency resolver
- [ ] Add rollback/recovery for failed skill updates

**Files to modify:**
- `server/skills/` - Make skills versioned and executable
- `server/utils/skillLoader.js` - Support dynamic installation

### **Phase 4: Distributed State & Event Sourcing** (Week 4-5)
- [ ] Migrate from file-backed to SQLite event store
- [ ] Implement event replay for state reconstruction
- [ ] Add audit logging for all agent actions
- [ ] Create agent snapshot/restore capability

**Files to create:**
- `server/utils/eventStore.js` - Event sourcing implementation
- `server/migrations/` - Schema migrations

### **Phase 5: Replica & Resilience** (Week 5-6)
- [ ] Implement agent replication strategy
- [ ] Add failover detection and takeover logic
- [ ] Create multi-agent coordination protocol
- [ ] Test under failure scenarios

**Files to modify:**
- `server/utils/taskQueue.js` - Add replica awareness
- `server/worker.js` - Add replica selection logic

---

## Architecture Comparison

| Aspect | Viktron (Current) | + Automaton (Enhanced) |
|--------|-------------------|----------------------|
| **Agent Execution** | Linear: Request→Execute→Result | Cyclic: Think→Act→Observe→Reflect→Decide |
| **Agent Count** | 1 per workspace | Many (spawned as needed) |
| **Learning** | None (static skills) | Continuous (self-modifying) |
| **Resilience** | Single point of failure | Replicated agents, auto-recovery |
| **State Management** | File-backed memory | Event-sourced SQLite |
| **Skill Management** | Static, versioned manually | Dynamic, installable, versioned |
| **Memory** | Search-only | Search + Semantic indexing (roadmap) |
| **Autonomy** | Task-reactive | Proactive + reactive |

---

## Expected Benefits

### Capability Enhancements
✅ **Parallel Execution**: Multiple spawned agents work simultaneously
✅ **Specialization**: Sales agent doesn't need support skills
✅ **Redundancy**: Failing agent replaced by replica
✅ **Learning**: Agents improve from each iteration
✅ **Autonomy**: Agents don't wait for human instruction

### Business Impact
💰 **Better Results**: Agents optimize their own prompts
🚀 **Faster Execution**: Parallel spawned agents
🛡️ **Reliability**: Replicas + event sourcing = audit trail
📈 **Scalability**: Each agent can manage sub-agents
🤖 **True Autonomy**: "Gets Smarter Every Day" becomes real

---

## Implementation Notes

### Do NOT Copy from Automaton
❌ Blockchain integration (out of scope for Viktron's enterprise focus)
❌ Self-interested agent survival mechanics (conflicts with enterprise control)
❌ Autonomous wallet/credential generation (security liability)
❌ Arbitrary code execution (AgentIRL already handles this safely)

### DO Adopt from Automaton
✅ Think→Act→Observe→Reflect loop
✅ Modular, versioned skill system
✅ Event sourcing for reliability
✅ Agent spawning/replication patterns
✅ Self-improvement mechanisms
✅ Persistent state with replay capability

---

## Success Criteria

**Phase 1**: Agent can observe its own outputs and adjust next steps
**Phase 2**: CEO Agent successfully spawns and coordinates 3+ child agents
**Phase 3**: Agent improves its own prompt based on success/failure
**Phase 4**: Agent state can be fully reconstructed from event log
**Phase 5**: Failed agent is transparently replaced by replica with zero user impact

---

## Timeline & Effort Estimate

| Phase | Effort | Timeline |
|-------|--------|----------|
| 1: Autonomous Loop | 2 weeks | M1 (Apr 21-May 5) |
| 2: Spawning | 2 weeks | M1 (May 5-19) |
| 3: Self-Learning | 2 weeks | M2 (May 19-Jun 2) |
| 4: Event Sourcing | 2 weeks | M2 (Jun 2-16) |
| 5: Resilience | 2 weeks | M2 (Jun 16-30) |
| **Total** | **10 weeks** | **June 30 completion** |

---

## Next Steps

1. **Review** this plan with product/engineering team
2. **Prioritize** phases based on business needs
3. **Allocate** engineering capacity
4. **Start Phase 1** with autonomous loop proof-of-concept
5. **Monitor** performance and adjust roadmap as needed

**This positioning makes Viktron the best agent platform: enterprise-reliable (AgentIRL) + autonomous-capable (Automaton patterns).**
