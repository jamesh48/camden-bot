import { FormEventHandler, ReactElement, useEffect, useState } from 'react';
import axios from 'axios';
import { ListResult, ZillowResults } from '@/components/types';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from '@mui/material';
import Image from 'next/image';

const ZillowApp = () => {
  const [zillowResults, setZillowResults] = useState([] as ListResult[]);
  const [filterDaysOnZillow, setFilterDaysOnZillow] = useState(1);

  const fetchZillowResults = async (filters: { daysOnZillow: number }) => {
    const { data } = await axios<ZillowResults>({
      url: '/api/zillow',
      params: { daysOnZillow: filters.daysOnZillow },
    });

    data.cat1?.searchResults.listResults.sort((a, b) => {
      if (a.addressCity === 'Boulder') {
        return -1;
      }
      return 0;
    });
    setZillowResults(data.cat1?.searchResults.listResults || []);
  };

  useEffect(() => {
    fetchZillowResults({ daysOnZillow: 1 });
  }, []);

  const constructListing = (item: ListResult, index: number) => {
    return (
      <Box
        key={index}
        sx={{
          padding: '.5rem',
          backgroundColor:
            item.addressCity === 'Boulder' ? 'lightblue' : 'initial',
        }}
      >
        <Image alt="img" src={item.imgSrc} width="400" height="300" />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="h5"
            sx={{ alignSelf: 'flex-end', textDecoration: 'underline' }}
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

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event?.preventDefault();
    fetchZillowResults({ daysOnZillow: filterDaysOnZillow });
  };

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => setFilterDaysOnZillow(Number(event.currentTarget.value));

  return (
    <Box>
      <Box sx={{ paddingBottom: '.5rem' }}>
        <Box>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <InputLabel htmlFor="my-input">Days On Zillow</InputLabel>
              <Input id="my-input" onChange={handleChange} />
            </FormControl>
          </form>
        </Box>
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
        {columns.map((column, index) => {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignSelf: 'flex-start',
                paddingRight: '3rem',
                height: '100%',
              }}
            >
              {column}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ZillowApp;
