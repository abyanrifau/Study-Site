import type { ComponentType } from "react";
import * as Core from "./Diagrams";
import * as Market from "./DiagramsMarket";
import * as Marketing from "./DiagramsMarketing";
import * as People from "./DiagramsPeople";
import * as Finance from "./DiagramsFinance";
import * as Strategy from "./DiagramsStrategy";
import * as Accounting from "./DiagramsAccounting";
import * as Global from "./DiagramsGlobal";
import * as Macro from "./DiagramsMacro";

/**
 * Every diagram, looked up by name. Built from the modules themselves, so a
 * new diagram appears on the unit's diagram page without being registered
 * anywhere else. Add a new module here and everything else follows.
 */
export const DIAGRAM_REGISTRY: Record<string, ComponentType | undefined> = {
  ...(Core as unknown as Record<string, ComponentType>),
  ...(Market as unknown as Record<string, ComponentType>),
  ...(Marketing as unknown as Record<string, ComponentType>),
  ...(People as unknown as Record<string, ComponentType>),
  ...(Finance as unknown as Record<string, ComponentType>),
  ...(Strategy as unknown as Record<string, ComponentType>),
  ...(Accounting as unknown as Record<string, ComponentType>),
  ...(Global as unknown as Record<string, ComponentType>),
  ...(Macro as unknown as Record<string, ComponentType>),
};
