import Home from "@/components/Home";
import CamdenBotTitle from "@/components/Title";
import { fetchCamdenResults } from "@/serverUtils/fetchCamdenResults";
import { FinalCamdenResults } from "@/serverUtils/types";

export default function App(props: { camdenResults: FinalCamdenResults[] }) {
  return (
    <>
      <CamdenBotTitle />
      <Home camdenResults={props.camdenResults} />
    </>
  );
}

export const getServerSideProps = async () => {
  const results = await fetchCamdenResults();
  return {
    props: { camdenResults: results },
  };
};
