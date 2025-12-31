
export enum GameState {
  DASHBOARD = 'DASHBOARD',
  OBSERVING = 'OBSERVING',
  ZOOMING = 'ZOOMING',
  BUILDING = 'BUILDING',
  CHARGING = 'CHARGING'
}

export interface Part {
  id: string;
  name: string;
  description: string;
  technicalSpecs?: {
    efficiency: string;
    input: string;
    id: string;
  };
  icon: string;
  isPlaced: boolean;
}

export const INITIAL_PARTS: Part[] = [
  { 
    id: 'pd-chip', 
    name: 'PD Controller', 
    description: 'Logic core for Power Delivery 3.0 negotiation.', 
    icon: '🧠', 
    isPlaced: false,
    technicalSpecs: { efficiency: '98%', input: '3.3V-20V', id: '#PD-8829-X' }
  },
  { 
    id: 'usbc-in', 
    name: 'USB-C Input', 
    description: '120V to 20V DC conversion node.', 
    icon: '🔌', 
    isPlaced: false,
    technicalSpecs: { efficiency: '94%', input: '120V AC', id: '#IN-9901-Z' }
  },
  { 
    id: 'usbc-out', 
    name: 'USB-C Output', 
    description: 'PD 60W dedicated output rail.', 
    icon: '⚡', 
    isPlaced: false,
    technicalSpecs: { efficiency: '96%', input: '20V DC', id: '#OUT-1102-A' }
  },
  { 
    id: 'ac-passthru', 
    name: 'Legacy Rail', 
    description: 'Bypasses lamp load to primary socket.', 
    icon: '💡', 
    isPlaced: false,
    technicalSpecs: { efficiency: '100%', input: '120V AC', id: '#RAIL-001-B' }
  },
];
