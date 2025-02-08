import { Paper, useTheme } from "@mui/material";
import ChartTitle from "./compoents/ChartTitle";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Label,
} from 'recharts';
import { FollowedAndCountObj, getTopTenFollowedAndCount } from "../../../backend/followingUtils";
import { toErrorPageException } from "../../../backend/errorUtils";
import MiddleText from "./compoents/MiddleText";
import { OR_TO_PUL } from "./compoents/chartColorPalettes";
import getRandomInt from "./compoents/randomRange";

/**
 *  Show the top 10 followed user.
 */
export function TopTenFollowedChart() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState<FollowedAndCountObj[]>([]);

  useEffect(() => {
    const refresh = async () => {
      try {
        const dataFromBackEnd = await getTopTenFollowedAndCount();
        setData(dataFromBackEnd);
      } catch (e: unknown) {
        toErrorPageException(navigate, e);
      }
    }

    refresh().catch(console.log);
  }, [navigate, setData]);

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: 390
      }}>
      <ChartTitle>
        Top 10 followed user
      </ChartTitle>

      {
        data.length === 0
          ?
          <MiddleText text={'No user follow data.'} />
          :
          <ResponsiveContainer>
            <ComposedChart
              height={350}
              data={data}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid stroke={'#f5f5f5'} />
              <XAxis dataKey={'username'} >
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

              <YAxis allowDecimals={false} >
                <Label
                  angle={270}
                  position={'left'}
                  style={{
                    textAnchor: 'middle',
                    fill: theme.palette.text.primary,
                    ...theme.typography.body1,
                  }}
                >
                  Number of following user
                </Label>
              </YAxis>

              {/* Show tool tip. */}
              <Tooltip />

              <Bar dataKey={'count'} barSize={40} >
                {data.map(value =>
                  <Cell key={value.username} fill={OR_TO_PUL[getRandomInt(0, OR_TO_PUL.length - 1)]} />
                )}
              </Bar>

              {/* Show the line */}
              <Line dataKey={'count'} type={'monotone'} stroke={theme.palette.primary.main} />
            </ComposedChart>
          </ResponsiveContainer>
      }
    </Paper>
  );
}