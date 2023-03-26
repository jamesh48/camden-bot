export type FloorPlanName = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type SuggestedFloorPlan = {
  availableUnits: number;
  availableUnitIds: string[];
  realPageUnitId: number;
  realPageFloorPlanId: number;
  name: FloorPlanName;
};

export type PageProps = { suggestedFloorPlans: SuggestedFloorPlan[] };

type NextDate = { moveInDate: string; leaseTerm: number; monthlyRent: number };

export type AllPriceDataResponse = NextDate[];

export type CamdenResult = {
  floorPlanName: FloorPlanName;
  availableUnitId: string;
  priceData: AllPriceDataResponse;
};
