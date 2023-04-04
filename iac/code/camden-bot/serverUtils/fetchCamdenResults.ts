import axios, { AxiosResponse } from 'axios';
import {
  CamdenResult,
  FinalCamdenResults,
  FloorPlanName,
  PageProps,
} from './types';
import desiredApartments from './data/desiredApartments.json';

export const fetchCamdenResults = async () => {
  const { data: rawHtml } = (await axios({
    url: 'https://www.camdenliving.com/apartments/broomfield-co/camden-interlocken',
  })) as AxiosResponse<String>;

  const startingIndex = rawHtml.indexOf('{"props"');
  const beginningOfDoc = rawHtml.slice(startingIndex);
  const endingIndex = beginningOfDoc.indexOf('</script>');
  const {
    props: {
      pageProps: { suggestedFloorPlans },
    },
  } = JSON.parse(beginningOfDoc.slice(0, endingIndex)) as {
    props: { pageProps: PageProps };
  };

  const allAvailableApartments = suggestedFloorPlans.reduce<
    {
      availableUnitId: string;
      graphQlUnitCode: number;
      graphQlFloorCode: number;
      floorPlanName: FloorPlanName;
    }[]
  >((total, floorPlan) => {
    total.push(
      ...floorPlan.availableUnitIds.map((availableUnitId) => ({
        availableUnitId,
        graphQlUnitCode: floorPlan.realPageUnitId,
        graphQlFloorCode: floorPlan.realPageFloorPlanId,
        floorPlanName: floorPlan.name,
      }))
    );
    return total;
  }, []);

  const matchedApartments = allAvailableApartments.filter(
    (apartment) => desiredApartments.indexOf(apartment.availableUnitId) !== -1
  );

  const allPriceData = await Promise.allSettled<CamdenResult>(
    matchedApartments.map((matchedApartment) => {
      return new Promise<CamdenResult>(async (resolve, reject) => {
        const { data: priceData } = await axios({
          url: 'https://api.camdenliving.com/graphql',
          method: 'POST',
          data: {
            query:
              'query ($communityId: Int!, $floorPlanId: Int!, $unitId: Int!, $moveInDate: String!, $leaseTerm: Int!) {\n  getCustomQuoteData(\n    communityId: $communityId\n    floorPlanId: $floorPlanId\n    unitId: $unitId\n    moveInDate: $moveInDate\n    leaseTerm: $leaseTerm\n  ) {\n    sameDayMoveIn\n    currentRent\n    leaseTerms {\n      leaseTerm\n    }\n    fees {\n      optional {\n        name\n        disclaimer\n        chargeType\n        amount\n        transactionCode\n      }\n      oneTime {\n        name\n        disclaimer\n        chargeType\n        amount\n        transactionCode\n      }\n      monthly {\n        name\n        disclaimer\n        chargeType\n        amount\n        transactionCode\n      }\n    }\n    nextDates {\n      moveInDate\n      leaseTerm\n      monthlyRent\n    }\n  }\n}\n',
            variables: {
              communityId: 1002451,
              floorPlanId: matchedApartment.graphQlFloorCode,
              unitId: matchedApartment.graphQlUnitCode,
              moveInDate: '2023-05-15',
              leaseTerm: 14,
            },
          },
        });
        if (!priceData.data.getCustomQuoteData) {
          return reject('error');
        }
        resolve({
          priceData: priceData.data.getCustomQuoteData.nextDates,
          availableUnitId: matchedApartment.availableUnitId,
          floorPlanName: matchedApartment.floorPlanName,
        });
      });
    })
  );

  const result = allPriceData.reduce<FinalCamdenResults[]>((total, item) => {
    if (item.status === 'rejected') {
      return total;
    }
    const preferredMoveInDatesOnly = item.value.priceData.filter(
      (x) => x.moveInDate >= '2023-05-15T00:00:00.000Z'
    );
    const minimumRent = Math.min(
      ...preferredMoveInDatesOnly.map((x) => x.monthlyRent)
    );
    const bestRentClosestToMoveIn = preferredMoveInDatesOnly
      .reverse()
      .find((x) => x.monthlyRent === minimumRent);

    total.push({
      apartment: item.value.availableUnitId,
      floorPlanName: item.value.floorPlanName,
      avgRent: (
        item.value.priceData.reduce((a, b) => a + b.monthlyRent, 0) /
        item.value.priceData.length
      ).toFixed(),
      bestRentClosestToMoveIn,
      priceData: item.value.priceData
        .sort((a, b) => a.monthlyRent - b.monthlyRent)
        .filter((x) => x.moveInDate >= '2023-05-15T00:00:00.000Z'),
    });
    return total;
  }, []);

  return result;
};
