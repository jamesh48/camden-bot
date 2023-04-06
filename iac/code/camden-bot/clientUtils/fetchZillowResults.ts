import { ZillowResults } from '@/components/types';
import axios from 'axios';

export const fetchZillowResultsClient = async (filters: {
  daysOnZillow: number;
  maxPrice: number;
}) => {
  const { data } = await axios<ZillowResults>({
    url: '/api/zillow',
    params: {
      daysOnZillow: filters.daysOnZillow,
      maxPrice: filters.maxPrice,
    },
  });

  if (typeof data === 'string') {
    return [];
  }

  data.cat1?.searchResults.listResults.sort((a) => {
    if (a.addressCity === 'Boulder') {
      return -1;
    }

    if (['Louisville', 'Superior', 'Lafayette'].includes(a.addressCity)) {
      return -1;
    }

    return 0;
  });

  const noTrailers = data.cat1?.searchResults.listResults.filter(
    (x) => x.addressStreet.indexOf('Lot') === -1
  );

  return noTrailers || [];
};
