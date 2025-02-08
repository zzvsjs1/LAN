import { Paper, useTheme } from "@mui/material";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTopTenProfileVisitUserAndCount, UserProfileVisitCountObj } from "../../../backend/userProfileVisitUtils";
import { toErrorPageException } from "../../../backend/errorUtils";
import ChartTitle from "./compoents/ChartTitle";
import MiddleText from "./compoents/MiddleText";
import { SAL_TO_AQUA } from "./compoents/chartColorPalettes";
import getRandomInt from "./compoents/randomRange";

export default function ProfileVisitsChart() {
  const theme = useTheme();
  const [data, setData] = useState<UserProfileVisitCountObj[]>([]);
  const navigate = useNavigate();

  // Fetch data.
  useEffect(() => {
    const refresh = async () => {
      try {
        const dataFromBackEnd = await getTopTenProfileVisitUserAndCount();
        setData(dataFromBackEnd);
      } catch (e: unknown) {
        toErrorPageException(navigate, e);
      }
    }

    refresh().catch(console.log);
  }, [navigate, setData]);

  // Similar to User per day chart.
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: 390
      }}
    >
      <ChartTitle>
        Top 10 user profile visit user
      </ChartTitle>

      {
        data.length === 0
          ?
          <MiddleText text={'No user visit data.'} />
          :
          <ResponsiveContainer>
            <BarChart
              height={350}
              data={data}
              margin={{
                top: 8,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey={'username'}
              >
                <Label
                  position={'bottom'}
                  // We need to fill the color by theme.
                  style={{
                    textAnchor: 'middle',
                    fill: theme.palette.text.primary,
                    ...theme.typography.body1,
                  }}
                >
                  Username
                </Label>
              </XAxis>

              <YAxis allowDecimals={false}>
                <Label
                  angle={270}
                  position={'left'}
                  style={{
                    textAnchor: 'middle',
                    fill: theme.palette.text.primary,
                    ...theme.typography.body1,
                  }}
                >
                  Number of visit
                </Label>
              </YAxis>

              <Tooltip />

              <Bar dataKey={'count'} barSize={40}>
                {data.map(value =>
                    <Cell
                      key={value.username}
                      fill={SAL_TO_AQUA[getRandomInt(0, SAL_TO_AQUA.length - 1)]}
                    />
                  )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
      }
    </Paper>
  );
}