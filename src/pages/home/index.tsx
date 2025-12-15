import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { dehydrate, useQuery } from '@tanstack/react-query';
import nextSvg from '@/resources/next.svg';
import getExample from '@/api/example';
import { createQueryClient } from '@/lib/query-client';

const Home = () => {
  const { data } = useQuery({
    queryKey: ['getExample'],
    queryFn: getExample,
  });

  return (
    <div>
      <Image src={nextSvg} alt="Next.js Logo" width={100} height={24} />
      <h1>Home</h1>
      {data && (
        <div>
          <p>Status: {data.data.success ? 'Success' : 'Failed'}</p>
          <p>Message: {data.data.message}</p>
        </div>
      )}
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = createQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['getExample'],
    queryFn: getExample,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};