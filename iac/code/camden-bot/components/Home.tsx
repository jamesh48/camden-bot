import { FinalCamdenResults } from '@/serverUtils/types';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';

const Home = (props: { camdenResults: FinalCamdenResults[] }) => {
  const splitCamdenResults = props.camdenResults.reduce<
    [FinalCamdenResults[], FinalCamdenResults[]]
  >(
    (total, item, index) => {
      if (index % 2 === 0) {
        total[0].push(item);
        return total;
      }
      total[1].push(item);
      return total;
    },
    [[], []]
  );
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: '95vh',
        maxWidth: '50vw',
        border: '1.5px solid black',
        overflow: 'auto',
        borderRadius: '1%',
      }}
    >
      {splitCamdenResults.map((camdenResults, index) => {
        return (
          <Box key={index} sx={{ display: 'flex' }}>
            {camdenResults.map((apartmentResult) => {
              console.info(apartmentResult);
              return (
                <Box key={apartmentResult.apartment} sx={{ display: 'flex' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      margin: '2rem',
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ textDecoration: 'underline' }}
                    >
                      Apartment: #{apartmentResult.apartment}
                    </Typography>
                    <Box sx={{ display: 'flex', ml: '1.25rem' }}>
                      <Box>
                        <Typography variant="h6">
                          Floor Plan: {apartmentResult.floorPlanName}
                        </Typography>
                        <Typography variant="h6">
                          Average Rent: ${apartmentResult.avgRent}
                        </Typography>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{ textDecoration: 'underline' }}
                          >
                            Best Move In:
                          </Typography>
                          <Box
                            sx={{
                              ml: '.5rem',
                              border: '1px solid black',
                              padding: '.5rem 1rem',
                              margin: '.25rem',
                            }}
                          >
                            <Typography>
                              Date:{' '}
                              {dayjs(
                                apartmentResult.bestRentClosestToMoveIn
                                  ?.moveInDate
                              ).format('M-DD-YYYY')}
                            </Typography>
                            <Typography>
                              Cost: $
                              {
                                apartmentResult.bestRentClosestToMoveIn
                                  ?.monthlyRent
                              }
                            </Typography>
                            <Typography>
                              Lease Term:{' '}
                              {
                                apartmentResult.bestRentClosestToMoveIn
                                  ?.leaseTerm
                              }{' '}
                              months
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
};

export default Home;
