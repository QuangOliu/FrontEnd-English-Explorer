import { useState, useEffect } from 'react';
import { generateSimilarColors } from 'helper';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

const baseColor = "#8884d8";

function MyLineChart({ data }) {
  const [chartWidth, setChartWidth] = useState(730);
  const [chartHeight, setChartHeight] = useState(500);

  useEffect(() => {
    const handleResize = () => {
      const containerWidth = document.getElementById('chart-container').clientWidth;
      const containerHeight = document.getElementById('chart-container').clientHeight;

      setChartWidth(containerWidth);
      setChartHeight(containerHeight);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const similarColors = generateSimilarColors(baseColor, 10);

  return (
    <div id="chart-container" style={{ width: '100%', height: '100%' }}>
      <LineChart width={chartWidth} height={chartHeight} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="pr" stroke={similarColors[1]} />
      </LineChart>
    </div>
  );
}

export default MyLineChart;
