Comprehensive Technical Analysis of Idle RPG Architecture: The AFK Arena Stack and Bartimaeus Mechanics
1. Introduction: The Convergence of Deterministic Simulation and Incremental Design
The development of high-fidelity Idle RPGs represents one of the most deceptively complex engineering challenges in modern game development. While the surface-level gameplay interaction—often characterized by minimal input and passive accumulation—appears simplistic, the underlying architecture requires a convergence of distinct and often contradictory software engineering disciplines. To successfully replicate the commercial and technical success of market leaders like AFK Arena, developers must master deterministic simulation, large-number mathematics involving custom data structures, and scalable distributed systems capable of verifying asynchronous states.
This report provides an exhaustive technical analysis of the mechanics and code infrastructure required to build a competitive Idle RPG, specifically analyzing the theoretical "AFK Arena Tech Stack" and its application to the proposed Bartimaeus Idle RPG. By dissecting the architectural patterns of successful titles, we can infer the necessary components for a robust system: a Unity-based client utilizing Data-Oriented Design (DOD), a server-authoritative backend via Azure PlayFab, and a rigorous mathematical framework governing exponential progression.
The analysis further integrates the specific narrative constraints of the Bartimaeus Sequence—a literary universe defined by summoning rituals and hierarchical entity management—to demonstrate how abstract incremental mechanics can be mapped onto complex magic systems. This synthesis of lore and logic provides a roadmap for constructing a game that is not only mechanically sound but thematically resonant.
2. The Idle Game Paradigm: Cognitive and Architectural Core Loops
To engineer a successful idle game, one must first understand the "Core Loop" not just as a design concept, but as a software process. The idle genre, or "incremental game," is defined by the optimization of growth curves where the primary interaction is the management of rates of change rather than direct manipulation of game states.
2.1 The Cycle of Active and Passive Accumulation
The fundamental loop of an Idle RPG consists of three distinct phases that the software architecture must support seamlessly. These phases dictate the requirements for the client-side state machine and the server-side validation logic.
Phase
Player Action
System State
Mathematical Operation
Active
Upgrading, Equipping, Summoning
State Mutation
\Delta R > 0 (Rate Increase)
Passive (Online)
Watching, Waiting
Real-time Simulation
Y_{t} = Y_{t-1} + (R \times \Delta t)
Passive (Offline)
App Terminated
Serialized Stasis
Y_{total} = Y_{last} + \int_{t_{0}}^{t_{1}} R(t) dt

Active Interaction (Setup Phase): In this phase, the player configures the system state. In AFK Arena, this involves leveling heroes, equipping gear, or adjusting formation positions. In the Bartimaeus context, this corresponds to drawing summoning circles or binding entities. The architectural requirement here is transactional integrity; the system must ensure that resources are deducted and stats are updated atomically to prevent race conditions or exploit vectors.
Passive Accumulation (The Idle Phase): Once the state is configured, the system advances time (t). The critical engineering distinction here is that time is the primary input resource. Unlike twitch-based games where input frames drive logic, idle games use deltaTime as a multiplier for production. This requires the game engine to decouple the rendering loop from the simulation loop, ensuring that resource generation remains accurate even if the frame rate drops or the device throttles performance.
Reinvestment and Expansion (The Feedback Loop): The accumulated resources are spent to increase the Rate of Change (R). This creates a positive feedback loop. Psychological research into the genre suggests that the "thrill" comes from the visible acceleration of this rate—watching numbers grow from linear integers to massive exponential notations. The tech stack must therefore support numbers far exceeding standard 64-bit floating-point limits to maintain this illusion of infinite scale without crashing the processor or losing precision.
2.2 The "Meta Loop" and Retention Mechanics
While the core loop drives minute-to-minute engagement, the "Meta Loop" drives long-term retention (Day 30+). In AFK Arena, this is manifested through the Hero Ascension system, the Campaign progression, and the "Resonating Crystal" mechanic.
The Resonating Crystal Architecture: A standout feature in AFK Arena is the Resonating Crystal, which synchronizes the level of a player's entire roster to the lowest level of their top five heroes. From a software perspective, this acts as a dependency injection system for entity stats. Instead of each hero entity storing its own Level integer, it subscribes to a GlobalLevelService.
Design Consequence: This decouples the resource cost of leveling from the number of units owned, solving the "too many units to upgrade" friction point common in RPGs.
Implementation: In an Entity-Component-System (ECS) architecture, this would be implemented as a SharedComponent containing the level data, which is referenced by thousands of hero entities simultaneously. This ensures O(1) complexity for updating the level of the entire roster.
Daily Sessions and Flexible Time: Analysis of AFK Arena's session design reveals a "Flexible Time" approach. Players can log in for 5 minutes to claim rewards (the idle accumulation) or stay for hours engaging in "Peaks of Time" or "Labyrinth" content. The backend must support this by batching server requests. When a player logs in, the client should send a single batch of "Claim" requests rather than spamming the server, reducing overhead and improving the "Welcome Back" experience.
3. Mathematical Frameworks of Exponential Progression
The spine of any incremental game is its math. Balancing the economy requires a sophisticated understanding of geometric sequences, logarithmic growth, and polynomial scaling. The choice of formulas dictates the pacing of the game—too fast, and the player finishes in a day; too slow, and they churn out of boredom.
3.1 The Standard Growth Formula and Coefficient Analysis
The industry-standard formula for calculating the cost of an upgrade is derived from geometric sequences. This formula is ubiquitous across titles like Cookie Clicker, Clicker Heroes, and AFK Arena because it provides a predictable, controllable cost curve.
The cost of the next upgrade (C_{next}) is calculated as:
Where:
C_{base} is the initial price of the upgrade (level 1).
r is the growth coefficient (rate).
n is the current level (number of upgrades owned).
The Battle of Coefficients: 1.07 vs. 1.15: Research indicates a stark bifurcation in the choice of r:
1.07 (7% Growth): Used by Clicker Heroes for hero leveling. This lower coefficient allows for "runs" of 25-100 levels at a time, creating a smooth feeling of rapid progression.
1.15 (15% Growth): Used by Cookie Clicker buildings and AFK Arena gear upgrades. This steeper curve creates distinct "walls" where the player must stop and wait (idle) for resources. It forces a change in strategy or a prestige reset.
For the Bartimaeus Idle RPG, considering the narrative weight of summoning high-level demons (which are dangerous and rare), a steeper coefficient like 1.15 or even 1.20 is recommended for the "Summoning Circle" upgrades. This emphasizes the difficulty of controlling stronger entities, aligning the math with the lore.
3.2 Closed-Form Summation for "Buy Max" Logic
A critical technical requirement for late-game play is the ability to buy massive quantities of upgrades instantly (e.g., "Buy 100" or "Buy Max"). A naive implementation would iterate through a for loop, calculating the cost for each level and summing them.
Problem: If a player wants to buy 10,000 levels, a for loop is computationally expensive, especially if run every frame for UI validation.
Solution: Developers must use the closed-form summation formula for a geometric series :
Where k is the number of levels to purchase. This allows the engine to calculate the cost of a million levels in a single CPU instruction step, maintaining 60 FPS even in deep endgame simulations.
Calculating "Max Purchasable": Conversely, the system needs to calculate how many levels (k) a player can afford given their current gold (G). This requires solving the equation for k using logarithms:
If the programming language does not support an arbitrary base log, the identity \log_r(x) = \frac{\ln(x)}{\ln(r)} is used.
3.3 Handling Hyper-Inflation: The BigDouble Architecture
Standard C# types are insufficient for idle games.
int: Max \approx 2 \times 10^9 (Too small).
long: Max \approx 9 \times 10^{18} (Reached within days).
double: Max \approx 1.8 \times 10^{308} (Reached within weeks).
Idle games routinely reach values like 10^{10000}. To handle this, the AFK Arena tech stack (and any serious idle game) utilizes a custom numeric library, most notably BreakInfinity.cs.
3.3.1 BreakInfinity.cs Internals
This library, a C# port of break_infinity.js, restructures numbers into a custom struct to prioritize speed over absolute precision (which is acceptable for games).
Structure:
public struct BigDouble {
    public double Mantissa; // Normalized value (e.g., 1.23)
    public long Exponent;   // Power of 10 (e.g., 500)
}


A value of 1.23 \times 10^{500} is stored as { Mantissa: 1.23, Exponent: 500 }.
Mathematical Operations: When performing addition (A + B), the library aligns the exponents.
If A = 1.0 \times 10^{50} and B = 5.0 \times 10^{48}.
Shift B to match A's exponent: B = 0.05 \times 10^{50}.
Add Mantissas: 1.0 + 0.05 = 1.05.
Result: 1.05 \times 10^{50}.
Optimization Strategy: If the difference in exponents is greater than ~17 (the precision limit of a double), the smaller number is ignored entirely. 10^{50} + 10^{10} \approx 10^{50}. This "lazy evaluation" saves massive processing time when aggregating millions of small resource ticks, which is crucial for mobile battery life.
3.4 Prestige Formulas: The Logarithmic Reset
Prestige (or "Rebirth") is the mechanic where a player resets their progress to gain a persistent multiplier. This effectively reduces the numbers back to manageable levels while maintaining the dopamine hit of progress.
The formula for Prestige Currency (P) gained is typically a root of the lifetime earnings (E):
This cube root formula (used in games like AdVenture Capitalist) ensures that to double the prestige currency, the player must earn 2^3 = 8 times more resources. This creates a "soft cap" on progress that can only be broken by engaging with the meta-layers (new heroes, artifacts).
For Bartimaeus, this maps to "Dismissal." Dismissing a demon (Reset) yields "True Name Fragments" (Prestige Currency). The formula ensures that summoning the same low-level imp repeatedly yields diminishing returns, forcing the player to summon dangerous Marids to make significant gains.
4. Software Architecture: ECS vs. OOP in Unity
The choice of software architecture is the single most critical decision in the pre-production phase of an idle RPG. While Unity's default behavior encourages Object-Oriented Programming (OOP), the AFK Arena tech stack demonstrates a shift toward Data-Oriented Design (DOD) or Entity-Component-System (ECS) patterns to handle scale.
4.1 The Bottlenecks of OOP (MonoBehaviour)
In a traditional Unity OOP approach, every entity (hero, enemy, projectile, gold coin) is a GameObject with an attached MonoBehaviour.
Update() Overhead: Unity calls the Update() method on every active MonoBehaviour every frame. This involves a C++ to C# context switch (marshaling), which incurs significant CPU overhead.
Memory Fragmentation: Objects are instantiated as reference types on the heap. They are scattered in memory, leading to CPU cache misses as the processor fetches data from disparate locations.
Coupling: Logic (the script) is tightly coupled to the data (the variables) and the representation (the mesh/sprite). You cannot easily run a "simulation" of the game without instantiating the heavy graphical objects.
For an idle game that needs to simulate 10,000 "ticks" of resource generation instantly when a player returns from being offline, OOP is catastrophically slow.
4.2 The Superiority of ECS (Entity Component System)
ECS architecture decouples Data from Behavior, a paradigm that aligns perfectly with the "spreadsheet" nature of idle games.
The Triad:
Entity: A unique identifier (integer). It has no data or logic itself.
Component: Pure data structs (Blittable types). E.g., Position, Health, ResourceGenerator.
System: Logic that iterates over entities with specific component signatures.
Why ECS for Bartimaeus/AFK Arena?
Performance: Systems iterate over arrays of contiguous memory (Archetypes). The CPU can pre-fetch data efficiently, and SIMD (Single Instruction, Multiple Data) instructions can process 4-8 operations per cycle.
Simulation Speed: A ResourceSystem can calculate the output of 500 summoning circles in microseconds because it is just iterating over an array of double values. It does not need to check for collisions, render sprites, or update UI for every single tick.
Scalability: You can scale from 5 units to 5,000 units with linear performance degradation, whereas OOP scales exponentially worse due to overhead.
4.3 Implementing a Hybrid Architecture (MVC + ECS)
While ECS is superior for simulation, Unity's UI system (UGUI/UI Toolkit) relies on OOP. Therefore, the "AFK Arena Tech Stack" likely utilizes a hybrid Model-View-Controller (MVC) approach.
Model (The ECS World): The source of truth. Handles all math, combat simulation, and resource accumulation. Uses BreakInfinity.cs.
View (Unity UI): The visual layer. It does not calculate anything. It simply polls the Model: text.text = Model.GetGold().ToString().
Controller (Input): Interprets player clicks (e.g., "Level Up") and sends commands to the Model (EntityCommandBuffer).
Code Example: Hybrid Resource System
// COMPONENT (Data)
public struct SummoningCircle : IComponentData {
    public int Level;
    public BigDouble BaseProduction;
    public BigDouble Multiplier;
}

// SYSTEM (Logic)
public partial class ResourceSystem : SystemBase {
    protected override void OnUpdate() {
        // DeltaTime is passed from the engine
        double dt = Time.DeltaTime; 
        
        // Iterate over all entities with SummoningCircle
        Entities.ForEach((ref PlayerInventory inventory, in SummoningCircle circle) => {
            BigDouble production = circle.BaseProduction * circle.Multiplier * dt;
            inventory.Mana += production;
        }).ScheduleParallel(); // multithreaded execution
    }
}


This separation allows the "Game Logic" to run independently of the "Game View," facilitating the fast-forwarding required for offline progress.
5. Offline Progression: The "Welcome Back" Mechanic
The defining feature of the idle genre is that the game plays itself while closed. Implementing this securely requires a robust algorithm that accounts for complex state changes, not just simple linear extrapolation.
5.1 The Timestamp Delta Algorithm
The naive implementation saves a timestamp when the game closes and compares it to the current time on open.
Save: PlayerPrefs.SetString("LastLogin", DateTime.UtcNow.ToString());
Load: TimeSpan timeAway = DateTime.UtcNow - DateTime.Parse(PlayerPrefs.GetString("LastLogin"));
Reward: Gold += ProductionPerSecond * timeAway.TotalSeconds;
The "Fallacy of Linearity": This works for simple games (e.g., Adventure Capitalist), but fails for RPGs like AFK Arena. In AFK Arena, heroes might die, skills might trigger, and the rate of production effectively changes if a stage is cleared.
Solution: AFK Arena uses Discrete Simulation. The server does not calculate TotalSeconds. Instead, it runs a simplified version of the combat logic. It might simulate "1 Battle" and if successful, grant the rewards and attempt the next battle. This is why players sometimes log in to find they have advanced several stages.
5.2 The "Tick-Based" Simulation Loop
To support complex offline behavior (like the Bartimaeus summons consuming mana over time or rebelling), the offline time is broken down into "Ticks."
The Algorithm:
Calculate TotalOfflineSeconds (e.g., 28,800 seconds for 8 hours).
Define a TickRate (e.g., 1 tick = 1 minute of game time).
Loop TotalOfflineSeconds / 60 times.
Inside the loop, execute SimulateMinute().
SimulateMinute() handles resource generation, cooldown reduction, and entity state checks (e.g., "Did the Imp rebel?").
Accumulate results.
This approach ensures that non-linear events (a buff expiring hour 2, a generator unlocking hour 4) are handled correctly. This simulation happens in a single frame upon loading, presenting the user with a summary.
5.3 Anti-Cheat: Server-Side Time Validation
A major vulnerability in client-side idle games is the "System Clock Exploit," where users manually advance their device's date to gain years of resources instantly.
The Solution: Trust No One (Client-side). The AFK Arena stack relies on Server-Authoritative Time.
The client requests the current time from the server (e.g., PlayFab or a custom NTP endpoint) on startup.
The client calculates timeAway based on the Server's last known timestamp for that player, stored in the database.
The Client sends a "Claim" request.
The Server calculates the reward. The client merely displays what the server returned.
If the client attempts to send a claim request saying "I have been offline for 10 years," the server checks its own database, sees the player was online 5 minutes ago, and rejects the request or bans the user.
6. Backend Infrastructure: The AFK Arena Tech Stack Analysis
Based on industry engineering blogs and analysis of the game's behavior, the "AFK Arena Tech Stack" is a hybrid of proprietary engine technology and scalable cloud services.
6.1 Microsoft PlayFab and CloudScript
Microsoft PlayFab is the backbone of many modern idle RPGs. It provides "Backend-as-a-Service" (BaaS), handling player accounts, inventory, and economy without the developer needing to manage raw SQL servers.
CloudScript (Azure Functions): The "Brain" of the backend is CloudScript. This allows developers to write server-side logic in JavaScript or C# that executes securely on Microsoft's servers.
Usage in Idle Games: When a player opens a chest or finishes a battle, the client does not say "Give me 500 gems." It says "I finished Battle 1-5."
The Script: The CloudScript function FinishBattle(battleID) runs. It looks up the rewards for Battle 1-5 in the server-side Title Data, generates the loot (handling RNG securely), adds it to the player's inventory, and returns the result to the client. This makes it impossible for clients to inject items or currency.
6.2 Data Persistence and JSON Schemas
Data persistence in idle games requires handling massive, nested data structures. A player might have 500 upgrades, each with a level, multiplier, and state.
JSON Schema Best Practices: Standardizing the save format is crucial. The save file should be a lightweight JSON object containing only dynamic data. Static data (e.g., the name of "Demon #5") should be stored in the game client or Title Data, not the user save.
Example Save Structure (Bartimaeus RPG):
{
  "playerId": "12345",
  "lastLogin": "2023-10-27T10:00:00Z",
  "resources": {
    "mana": "1.54e20",
    "influence": "500"
  },
  "entities": [
    { "id": "imp_01", "level": 50, "bound": true },
    { "id": "djin_03", "level": 12, "bound": false }
  ]
}


Using schemas allows for validation and ensures that updates (patching the game) do not corrupt existing saves. Libraries like Newtonsoft.Json (Unity) are standard for serializing/deserializing this data efficiently.
6.3 Network Protocol: Protobuf vs. JSON
While JSON is great for save files, it is bloated for network traffic. AFK Arena likely uses Protocol Buffers (Protobuf) for client-server communication.
Efficiency: Protobuf compiles data into binary format, reducing packet size by up to 80% compared to JSON. For a mobile game where users might be on shaky 4G connections, this bandwidth saving translates to faster load times and less battery drain.
Reverse Engineering: Protobuf also acts as a mild obfuscation layer. Reverse engineering the network traffic requires decoding the .proto files, which is significantly harder than reading plain text JSON, adding a layer of security against casual botting.
7. Case Study Integration: The Bartimaeus Idle RPG
Applying the "AFK Arena Tech Stack" to the Bartimaeus literary universe creates a unique set of mechanical and architectural requirements.
7.1 Thematic Mechanics and Systems
Core Loop: Summoning and Binding In the books, magic is not innate; it is the act of compelling spirits.
Mechanic: The player acts as a Magician. The "Generators" are summoned entities (Imps, Foliots, Djinn, Afrits, Marids).
Constraint: Unlike Cookie Clicker, where you can own 500 grandmas, a Magician has mental limits. The game should implement a "Concentration Cap" (Slot Limit).
Tech Implication: This suggests a "Deck Building" or "Loadout" architecture similar to AFK Arena's team composition, rather than infinite building accumulation. The ECS architecture is perfect here: Entity = Spirit, Components = {PowerLevel, RebellionChance, ManaUpkeep}.
Prestige Layer: The "Other Place" Prestige in this game maps to gaining knowledge of the "Other Place" (the demon dimension).
Mechanic: "Dismissal." Sending a high-level entity back grants "True Name Fragments."
Math: The formula for Fragments would be based on the entity's Power Level at dismissal. This creates a strategic decision: Keep the Djinn for resource generation, or Dismiss it to permanently buff future summons?.
7.2 Security and "True Names"
The concept of a "True Name" acts as a perfect metaphor for an encryption key or a unique GUID in the database.
Implementation: When a player summons a Marid, the server generates a unique GUID (True Name). This GUID is required for all interaction with that entity. If a hacker tries to modify the entity's stats without the correct GUID/Hash signature, the server rejects the command, thematically simulating the demon breaking free and killing the magician.
7.3 Tech Stack Recommendation
Based on the analysis, the recommended stack for the Bartimaeus Idle RPG is:
Component
Technology
Reasoning
Engine
Unity 2022 LTS
Industry standard, robust UI, ECS support.
Language
C#
Native Unity support, strong typing.
Math Lib
BreakInfinity.cs
Essential for 10^{308}+ scaling.
Backend
Azure PlayFab
Free tier generous, CloudScript for validation.
Data
ScriptableObjects
Storing static demon data (Base stats, Lore).
Save System
JSON (Locally)
Encrypted locally, synced to PlayFab via API.
Protocol
HTTPS/REST
Simpler than Protobuf for a startup, sufficient for idle.

8. Economy Balancing and Visualization
The final piece of the puzzle is the "Invisible" tech: the balancing spreadsheets.
8.1 Modeling the Economy
Before writing a single line of code, the economy must be modeled in Excel or Google Sheets.
Columns: Level, Cost, Production, Time_To_Next_Level.
Visualization: Graph the Time_To_Next_Level. It should not be flat. It should curve upward (increasing difficulty) and then drop sharply (Prestige/Upgrade unlock), creating a "Sawtooth" pattern. This pattern keeps players engaged by offering frequent, short-term goals followed by long-term grinds.
8.2 The "Wall" Design
In AFK Arena, players hit "Dust Walls" (Hero Essence). In Bartimaeus, this could be "Silver" (for protective circles).
Implementation: Introduce a secondary currency that grows linearly while the primary currency grows exponentially.
Mana (Primary): 1.15^n cost scaling.
Silver (Limiter): Linear scaling (100 \times n).
Eventually, the linear cost of Silver becomes the bottleneck because its generation rate is strictly capped (e.g., Daily Quests only). This forces the player to engage with the Meta Loop (logging in daily) rather than just idling forever.
9. Conclusion
The "AFK Arena Tech Stack" is not merely a collection of tools but a specific architectural philosophy: Decoupled Simulation. By separating the data (ECS) from the view (Unity), and the validation (CloudScript) from the client, developers can create games that are performant, secure, and infinitely scalable.
For the Bartimaeus Idle RPG, the path to success lies in rigorously applying these patterns. The magic system of the books—defined by rules, constraints, and hierarchies—is a perfect narrative wrapper for the mathematical rules of incremental games. By utilizing BreakInfinity.cs to handle the immense power of Marids, employing Server-Authoritative time to prevent "temporal manipulation" (cheating), and modeling the economy on the proven "Sawtooth" engagement curves, the project can transcend a simple clone and become a deep, engaging system mastery experience.
The integration of AFK Arena's specific retention mechanics (Resonating Crystal) with Bartimaeus's lore (Summoning hierarchies) offers a novel design space, but it is the robustness of the underlying C# ECS architecture and Azure backend that will determine its viability as a product.
Appendix A: Mathematical Reference Tables
Table 1: Growth Coefficient Impact
Coefficient (r)
Level 10 Cost
Level 50 Cost
Level 100 Cost
Gameplay Feel
1.07
1.9 \times Base
29 \times Base
867 \times Base
Fast, linear feel. Good for rapid clicking.
1.15
4.0 \times Base
1,083 \times Base
1.1 \times 10^6 \times Base
Strategic, noticeable "walls". Standard for buildings.
1.25
9.3 \times Base
70,064 \times Base
4.9 \times 10^9 \times Base
Very steep. Used for "OP" upgrades or prestiges.

Table 2: BigDouble Structure
Property
Type
Description
Mantissa
double
The normalized value (e.g., 4.56).
Exponent
long
The magnitude (e.g., 10^15).
ToString()
Method
formats to "4.56aa" or "4.56e15".

Appendix B: Code Snippets
B.1 PlayFab CloudScript (JavaScript) for Offline Validation
handlers.claimOfflineRewards = function (args, context) {
    var lastLogin = server.GetUserInternalData({
        PlayFabId: currentPlayerId,
        Keys:
    }).Data.Value;

    var now = new Date().getTime();
    var last = new Date(lastLogin).getTime();
    var secondsAway = (now - last) / 1000;

    // Cap time at 12 hours (43200 seconds)
    if (secondsAway > 43200) secondsAway = 43200;

    // Get Production Rate from Title Data (Secure)
    var productionRate = 100; // Example
    var rewards = secondsAway * productionRate;

    // Grant Rewards
    server.AddUserVirtualCurrency({
        PlayFabId: currentPlayerId,
        VirtualCurrency: "GD",
        Amount: rewards
    });

    return { "rewards": rewards, "seconds": secondsAway };
};


B.2 BreakInfinity C# Usage
using BreakInfinity;

public BigDouble CalculateCost(BigDouble baseCost, int level, double rate) {
    // Formula: Base * Rate^Level
    return baseCost * BigDouble.Pow(rate, level);
}

public void BuyUpgrade() {
    BigDouble cost = CalculateCost(10, currentLevel, 1.15);
    if (currency >= cost) {
        currency -= cost;
        currentLevel++;
    }
}


Works cited
1. How to design idle games - Machinations.io, https://machinations.io/articles/idle-games-and-how-to-design-them 2. What If Idle RPGs Let You Design the Auto-Battle? | by woojisung - Medium, https://medium.com/@sexwoojisung/what-if-idle-rpgs-let-you-design-the-auto-battle-0ab3cdb24295 3. Building an Idle game Part 1 - Theory - DEV Community, https://dev.to/1e4_/building-an-idle-game-part-1-theory-3fb3 4. The Math and Design of Idle Games - GDC Vault, https://media.gdcvault.com/gdceurope2016/presentations/Pecorella_Anthony_Quest%20for%20Progress.pdf 5. Math — the backbone of Idle Games | by Dik Medvešček Murovec | Medium, https://medvescekmurovec.medium.com/math-the-backbone-of-idle-games-part-1-f46b54706cf1 6. AFK Endgame Theory + Mechanics v1.02 (Based on 1.59, updated for 1.63) : r/afkarena, https://www.reddit.com/r/afkarena/comments/nc5dty/afk_endgame_theory_mechanics_v102_based_on_159/ 7. Flexible time session design in AFK Arena - Game Developer, https://www.gamedeveloper.com/design/flexible-time-session-design-in-afk-arena 8. Numbers Getting Bigger: The Design and Math of Incremental Games | Envato Tuts+, https://code.tutsplus.com/numbers-getting-bigger-the-design-and-math-of-incremental-games--cms-24023a 9. The Math of Idle Games, Part I - Game Developer, https://www.gamedeveloper.com/design/the-math-of-idle-games-part-i 10. The Math of Idle Games, Part I, https://blog.kongregate.com/the-math-of-idle-games-part-i/ 11. c# - Incremental game formula issue - Stack Overflow, https://stackoverflow.com/questions/65608887/incremental-game-formula-issue 12. Razenpok/BreakInfinity.cs: Double replacement for ... - GitHub, https://github.com/Razenpok/BreakInfinity.cs 13. (Ep 1.5) Big Numbers with BreakInfinity! - Unity C# Idle Game Tutorial Series [2021 Edition], https://www.youtube.com/watch?v=2bzZ-rUYWVE 14. Hey! I am making small Unity open source library for big number! : r/incremental_games, https://www.reddit.com/r/incremental_games/comments/piv89g/hey_i_am_making_small_unity_open_source_library/ 15. C# log base 10 and rounding up to nearest power of 10? - Stack Overflow, https://stackoverflow.com/questions/2940801/c-sharp-log-base-10-and-rounding-up-to-nearest-power-of-10 16. The Math of Idle Games, Part III, https://blog.kongregate.com/the-math-of-idle-games-part-iii/ 17. The Math of Idle Games, Part III - Game Developer, https://www.gamedeveloper.com/design/the-math-of-idle-games-part-iii 18. Architecture, Performance, and Games · Introduction - Game Programming Patterns, https://gameprogrammingpatterns.com/architecture-performance-and-games.html 19. Unity Architecture: GameObject Component Pattern - Medium, https://medium.com/@simon.nordon/unity-architecture-gameobject-component-pattern-34a76a9eacfb 20. Entity component system - Wikipedia, https://en.wikipedia.org/wiki/Entity_component_system 21. ECS for Unity, https://unity.com/ecs 22. Unity-Technologies/hello-cube-ecs-training - GitHub, https://github.com/Unity-Technologies/hello-cube-ecs-training 23. scellecs/morpeh: ECS Framework for Unity Game Engine and .Net Platform - GitHub, https://github.com/scellecs/morpeh 24. Difference between MVC and ECS - Software Engineering Stack Exchange, https://softwareengineering.stackexchange.com/questions/379076/difference-between-mvc-and-ecs 25. Improve Your Unity Code with MVC/MVP Architectural Patterns - YouTube, https://www.youtube.com/watch?v=v2c589RaiwY 26. Idle Game Demo (Using Unity D.O.T.S) - Izzet_Dev - itch.io, https://izzet-dev.itch.io/idle-game-demo-using-ecs 27. There's definitely a problem with afk autoprogress : r/AFKJourney - Reddit, https://www.reddit.com/r/AFKJourney/comments/1p6afmm/theres_definitely_a_problem_with_afk_autoprogress/ 28. How did others design their offline progression system for their idle game? - Reddit, https://www.reddit.com/r/incremental_games/comments/ap0wlq/how_did_others_design_their_offline_progression/ 29. Algorithms for calculating offline resource progression in an idle game : r/gamedev - Reddit, https://www.reddit.com/r/gamedev/comments/dj3ptr/algorithms_for_calculating_offline_resource/ 30. How can I implement Offline Skilling - Game Development Stack Exchange, https://gamedev.stackexchange.com/questions/7484/how-can-i-implement-offline-skilling 31. Offline Progress: Time Cheating in Idle Games : r/GameDevelopment - Reddit, https://www.reddit.com/r/GameDevelopment/comments/1q12s98/offline_progress_time_cheating_in_idle_games/ 32. Writing custom CloudScript - PlayFab - Microsoft Learn, https://learn.microsoft.com/en-us/gaming/playfab/live-service-management/service-gateway/automation/cloudscript/writing-custom-cloudscript 33. PlayFab Consumption Best Practices - Microsoft Learn, https://learn.microsoft.com/en-us/gaming/playfab/pricing/consumption-best-practices 34. Exploring Game Saves: JSON # 2 Arrays | Game Dev Tutorial - YouTube, https://www.youtube.com/watch?v=CrT4RXyYBxs 35. What is your method for saving game data? JSON? : r/godot - Reddit, https://www.reddit.com/r/godot/comments/1cd009u/what_is_your_method_for_saving_game_data_json/ 36. Reverse Engineering Network Protocols - Jack Hacks, https://jhalon.github.io/reverse-engineering-protocols/ 37. Reverse Engineering Network Protocols : r/ReverseEngineering - Reddit, https://www.reddit.com/r/ReverseEngineering/comments/yru6p/reverse_engineering_network_protocols/ 38. Make Progress - My first incremental game : r/incremental_games - Reddit, https://www.reddit.com/r/incremental_games/comments/fh70pk/make_progress_my_first_incremental_game/ 39. What is the level of technology in the Bartimaeus series? - Sci-Fi Stack Exchange, https://scifi.stackexchange.com/questions/218199/what-is-the-level-of-technology-in-the-bartimaeus-series 40. Lesson Night: Using Simple Spreadsheet Techniques to Help Balance Your Game, https://www.youtube.com/watch?v=WqfZV2Wlb1g 41. Balancing Tips: How We Managed Math on Idle Idol - Game Developer, https://www.gamedeveloper.com/design/balancing-tips-how-we-managed-math-on-idle-idol
