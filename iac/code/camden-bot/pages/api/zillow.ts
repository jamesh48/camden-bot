import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { daysOnZillow, maxPrice } = req.query;
  try {
    const { data } = await axios({
      url: `https://www.zillow.com/search/GetSearchPageState.htm?searchQueryState=%7B%22mapBounds%22%3A%7B%22north%22%3A40.130080850295705%2C%22south%22%3A39.83096483330524%2C%22east%22%3A-104.83944876766911%2C%22west%22%3A-105.46086295223942%7D%2C%22isMapVisible%22%3Atrue%2C%22filterState%22%3A%7B%22price%22%3A%7B%22min%22%3A0%2C%22max%22%3A${maxPrice}%7D%2C%22doz%22%3A%7B%22value%22%3A%22${daysOnZillow}%22%7D%2C%22sortSelection%22%3A%7B%22value%22%3A%22globalrelevanceex%22%7D%2C%22isAllHomes%22%3A%7B%22value%22%3Atrue%7D%2C%22isLotLand%22%3A%7B%22value%22%3Afalse%7D%7D%2C%22isListVisible%22%3Atrue%2C%22mapZoom%22%3A12%7D&wants={%22cat1%22:[%22listResults%22,%22mapResults%22],%22cat2%22:[%22total%22],%22regionResults%22:[%22regionResults%22]}&requestId=45
    `,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Connection: 'keep-alive',
        Accept: '*/*',
        'User-Agent':
          'PostmanRuntime/' +
          Math.random() +
          '.' +
          Math.random() +
          '.' +
          Math.random(),
      },
    });

    return res.send(data);
  } catch (err) {
    res.send('error');
  }
};

export default handler;
