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

export interface CamdenResult {
  floorPlanName: FloorPlanName;
  availableUnitId: string;
  priceData: AllPriceDataResponse;
}

export interface FinalCamdenResults {
  apartment: string;
  floorPlanName: FloorPlanName;
  avgRent: string;
  bestRentClosestToMoveIn: NextDate | undefined;
  priceData: NextDate[];
}
