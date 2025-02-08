import React, { useEffect, useState } from 'react';
import { LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Label, Tooltip, ResponsiveContainer } from 'recharts';
import { Paper, useTheme } from "@mui/material";
import ChartTitle from "./compoents/ChartTitle";
import MiddleText from "./compoents/MiddleText";
import { getUserPerDayLast10Days, UserPerDayObj } from "../../../backend/userPerDayUtils";
import { useNavigate } from "react-router-dom";
import { toErrorPageException } from "../../../backend/errorUtils";
import { COLOR_BLUE_TO_RED } from "./compoents/chartColorPalettes";

function processData(data: UserPerDayObj[]): UserPerDayObj[] {
  // Use any in here. Because we need to change the data type.
  return data.map(value => {
    const temp: any = { ...value };
    temp.date = new Date(value.date);
    return temp;
  })
    // Early at the beginning.
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(value => {
      const temp: any = { ...value };
      temp.date = temp.date.toLocaleDateString('en-au');
      return temp;
    });
}

export default function UserPerDayChart() {
  // We need the theme to change the text color when needed.
  const theme = useTheme();
  const [data, setData] = useState<UserPerDayObj[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get data, and set data to state.
    const fetchData = async () => {
      try {
        const newData = await getUserPerDayLast10Days();
        setData(processData(newData));
      } catch (e: unknown) {
        toErrorPageException(navigate, e);
      }
    };

    fetchData().catch(console.log);
  }, [setData, navigate]);

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: 380
      }}
    >
      <ChartTitle>
        Number of users using LAN per day(Last 10 days)
      </ChartTitle>

      {
        data.length === 0
          ?
          <MiddleText text={'No user using data.'} />
          :
          /* The actual chart. */
          <ResponsiveContainer>
            <LineChart
              data={data}
              height={350}
              // Give some space to our chart.
              margin={{
                top: 8,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={'date'}>
                <Label
                  position={'bottom'}
                  // We need to fill the color by theme.
                  style={{
                    textAnchor: 'middle',
                    fill: theme.palette.text.primary,
                    ...theme.typography.body1,
                  }}
                >
                  Day
                </Label>
              </XAxis>

              <YAxis allowDecimals={false}>
                {/* Fill the axis label */}
                <Label
                  angle={270}
                  position={'left'}
                  style={{
                    textAnchor: 'middle',
                    fill: theme.palette.text.primary,
                    ...theme.typography.body1,
                  }}
                >
                  Number of user
                </Label>
              </YAxis>

              <Tooltip />

              <Line
                dataKey={'count'}
                fill={theme.palette.secondary.main}
              >
                {/* Fill random color. */}
                {data.map((value: UserPerDayObj, index: number) =>
                  <Cell key={value.date} fill={COLOR_BLUE_TO_RED[index % COLOR_BLUE_TO_RED.length]} />
                )}
              </Line>
            </LineChart>
          </ResponsiveContainer>
      }
    </Paper>
  )
}