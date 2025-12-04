import Image from 'next/image'

import nextSvg from '@/resources/next.svg'

const Home = () => {
    return (
        <div>
            <Image src={nextSvg} alt="Next.js Logo" width={100} height={24} />
            <h1>Home</h1>
        </div>
    );
};

export default Home;
