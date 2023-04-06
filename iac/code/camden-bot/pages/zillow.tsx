import { FormEventHandler, ReactElement, useEffect, useState } from 'react';
import axios from 'axios';
import { ListResult, ZillowResults } from '@/components/types';
import { Box, Typography, FormControl, InputLabel, Input } from '@mui/material';
import Image from 'next/image';
import { fetchZillowResults } from '@/serverUtils/fetchZillowResults';
import { fetchZillowResultsClient } from '@/clientUtils/fetchZillowResults';

export const getServerSideProps = async () => {
  const results = await fetchZillowResults();
  return results;
};

const ZillowApp = (props: ZillowResults) => {
  const [zillowResults, setZillowResults] = useState([] as ListResult[]);
  const [filterDaysOnZillow, setFilterDaysOnZillow] = useState(1);
  const [filterMaxPrice, setFilterMaxPrice] = useState(500000);

  useEffect(() => {
    setZillowResults(props.cat1?.searchResults.listResults || []);
  }, []);

  const colorMap = {
    Boulder: 'lightgreen',
    Louisville: 'lightblue',
    Superior: 'violet',
    Lafayette: 'violet',
  };

  const constructListing = (item: ListResult, index: number) => {
    return (
      <Box
        key={index}
        sx={{
          padding: '.5rem',
          backgroundColor: colorMap[item.addressCity] || 'initial',
        }}
      >
        <Image alt="img" src={item.imgSrc} width="400" height="300" />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="h5"
            sx={{
              alignSelf: 'flex-end',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() => window.open(item.detailUrl)}
          >
            {item.statusText}, {item.price}
          </Typography>
          <Typography>{item.address}</Typography>
          <Typography>
            {item.addressCity}, {item.addressState}
          </Typography>
        </Box>
      </Box>
    );
  };

  const columns = zillowResults.reduce<ReactElement[][]>(
    (total, item, index) => {
      if (index === 0 || index % 3 === 0) {
        total.push([constructListing(item, index)]);
      } else {
        total[total.length - 1].push(constructListing(item, index));
      }
      return total;
    },
    []
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event?.preventDefault();
    const clientSideZillowResults = await fetchZillowResultsClient({
      daysOnZillow: filterDaysOnZillow,
      maxPrice: filterMaxPrice,
    });

    setZillowResults(clientSideZillowResults);
  };

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => setFilterDaysOnZillow(Number(event.currentTarget.value));

  const handleMaxPriceChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => setFilterMaxPrice(Number(event.currentTarget.value));

  return (
    <Box>
      <Box sx={{ paddingBottom: '.5rem', display: 'flex' }}>
        <form onSubmit={handleSubmit}>
          <FormControl sx={{ paddingRight: '2rem' }}>
            <InputLabel htmlFor="my-input">Days On Zillow</InputLabel>
            <Input
              id="my-input"
              onChange={handleChange}
              value={filterDaysOnZillow}
            />
          </FormControl>
        </form>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <InputLabel htmlFor="my-input">Max Price</InputLabel>
            <Input
              id="my-max-price-input"
              onChange={handleMaxPriceChange}
              value={filterMaxPrice}
            />
          </FormControl>
        </form>
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: '90vw',
          height: '90vh',
          alignItems: 'center',
          alignContent: 'center',
          overflowY: 'scroll',
          border: '1.5px solid black',
          padding: '1.5rem',
        }}
      >
        {columns.length ? (
          columns.map((column, index) => {
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  alignSelf: 'flex-start',
                  paddingRight: '3rem',
                }}
              >
                {column}
              </Box>
            );
          })
        ) : (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <Typography sx={{ textDecoration: 'underline' }} variant="h6">
              There was an Error fetching Zillow Results
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ZillowApp;
