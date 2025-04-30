import { Link } from 'react-router-dom';
import introGif from '../assets/intro.gif';
import mainTypo from '../assets/main-typo.png';
import MobileLayout from '../components/layouts/MobileLayout';

const HomePage = () => {
  return (
    <MobileLayout backgroundColor="#ffedc033">
      <div className="h-full w-full flex flex-col items-center justify-start p-5">
        <div className="flex flex-col items-center w-full z-10 animate-fadeIn">
          <div className="mb-8">
            <img
              src={mainTypo}
              alt="의식적인 연습 Meetup"
              className="w-full max-w-[300px] h-auto"
            />
          </div>

          <div className="flex justify-center w-full">
            <img
              src={introGif}
              alt="Introduction"
              className="w-full max-w-[300px] h-auto rounded-lg"
            />
          </div>
        </div>

        <Link
          to="/join"
          className="bg-[#ff9900] hover:bg-[#ff9900] active:bg-[#ff9900] text-white hover:text-white active:text-white text-xl font-bold py-3 px-8 rounded-lg cursor-pointer w-full max-w-[320px] text-center mt-auto mb-8 animate-pulse outline-none focus:outline-none hover:outline-none active:outline-none focus:ring-0"
          style={{ outline: 'none' }}
        >
          참여하기
        </Link>
      </div>
    </MobileLayout>
  );
};

export default HomePage;
