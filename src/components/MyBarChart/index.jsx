import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";

function MyBarChart({data}) {
  return (
    <div>
      <BarChart width={1000} height={500} data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey='ds' fill='#8884d8' />
      </BarChart>
    </div>
  );
}

export default MyBarChart;
