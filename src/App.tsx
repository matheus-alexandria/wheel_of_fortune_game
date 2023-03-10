import { useMemo, useState } from 'react';
import { OptionsMenu } from './components/OptionsMenu';
import { WheelOfFortune } from './components/WheelOfFortune';
import { WheelOptionModel } from './model/WheelOptionModel';
import './styles/global.css';

const optionsTest: WheelOptionModel[] = [
  {
    title: "D",
    percentage: 100
  },
  {
    title: "D",
    percentage: 100
  },
  {
    title: "D",
    percentage: 100
  },
  {
    title: "D",
    percentage: 100
  },
  {
    title: "D",
    percentage: 100
  },
  {
    title: "D",
    percentage: 100
  },
  {
    title: "D",
    percentage: 100
  },
  {
    title: "D",
    percentage: 100
  },
  {
    title: "D",
    percentage: 100
  },
  {
    title: "D",
    percentage: 100
  },
  {
    title: "D",
    percentage: 100
  },
  {
    title: "D",
    percentage: 100
  },
  {
    title: "D",
    percentage: 100
  },
  {
    title: "D",
    percentage: 100
  },
  {
    title: "D",
    percentage: 100
  },
]

export function App() {
  const [wheelOptions, setWheelOptions] = useState<WheelOptionModel[]>([]);
  const [winner, setWinner] = useState('');

  function handleWheelOptions(options: WheelOptionModel[]) {
    setWheelOptions([...options]);
  }

  const chancesArray = useMemo(() => {
    const wheelChances: string[] = [];
    wheelOptions.forEach((wheel) => {
      let amount = wheel.percentage;
      while (amount > 0) {
        wheelChances.push(wheel.title);
        amount -= 1;
      }
    });

    return wheelChances;
  }, [wheelOptions]);

  function handleChooseWinner() {
    const winnerIndex = Math.floor(Math.random() * chancesArray.length);

    setWinner(chancesArray[winnerIndex]);
  }

  return (
    <div className='w-full h-screen flex items-center justify-center bg-zinc-700'>
      <div className='w-1/2 flex flex-col items-center justify-center gap-2 mr-4'>
        <WheelOfFortune options={wheelOptions} />
        {/* <span className='text-3xl text-white font-extrabold'>{winner}</span> */}
      </div>

      <OptionsMenu wheelOptions={wheelOptions} handleWheelOptions={handleWheelOptions} />
      
    </div>
  )
}