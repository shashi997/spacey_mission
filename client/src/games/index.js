import SolarFlareDemo from "./SolarFlareDemo";
import CircuitRepairDemo from "./CircuitRepairDemo";
import AIConflictDemo from "./aiConflictDemo";
import ComplicationDemo from "./ComplicationDemo";
import ResourceAllocationDemo from "./ResourceAllocationDemo";

/**
 * The GameRegistry maps a unique game_id from the lesson data
 * to the corresponding React component. This allows the InteractionPanel
 * to dynamically render the correct interactive demo.
 */
export const GameRegistry = {
  solar_flare_demo: SolarFlareDemo,
  circuit_repair_demo: CircuitRepairDemo,
  ai_conflict_demo: AIConflictDemo,
  complication_demo: ComplicationDemo,
  resource_allocation_demo: ResourceAllocationDemo,
};
