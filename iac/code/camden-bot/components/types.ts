export type ListResult = {
  imgSrc: string;
  detailUrl: string;
  statusType: 'FOR_SALE';
  statusText: 'Coming soon';
  countryCurrency: '$';
  price: string;
  unformattedPrice: number;
  address: string;
  addressStreet: string;
  addressCity: string;
  addressState: 'CO';
  addressZipcode: string;
};

export interface ZillowResults {
  cat1?: {
    searchResults: {
      listResults: ListResult[];
    };
  };
}
