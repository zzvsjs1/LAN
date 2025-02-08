import { PieChart, Pie, Cell, ResponsiveContainer, Label, Tooltip } from "recharts";
import ChartTitle from "./compoents/ChartTitle";
import MiddleText from "./compoents/MiddleText";
import { Paper, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toErrorPageException } from "../../../backend/errorUtils";
import {
  getAllPostReactions,
  getAllReplyReactions,
  PostReactionObj,
  ReplyReactionObj
} from "../../../backend/reactionUtils";
import { REACTION_LIKE } from "../../../backend/reactionKey";
import { PINK_FOAM } from "./compoents/chartColorPalettes";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface PercentageData {
  percentage: number,
}

const DATA_KEY = 'percentage';
const RADIAN = Math.PI / 180;

/**
 * Further process post reaction object.
 * Convert the object into percentage data.
 * The reason why I repeat these code is that PostReactionObj and ReplyReactionObj
 * are different.
 *
 * @param postReactions
 */
function processPostReaction(postReactions: PostReactionObj[]): PercentageData[] {
  // If total equal to 0, just return 0.
  if (postReactions.length === 0) {
    return [{ percentage: 0 }, { percentage: 0 }];
  }

  const likeCount = postReactions.filter(value => value.type === REACTION_LIKE).length;
  const disLikeCount = postReactions.length - likeCount;
  const total = postReactions.length;

  return [{ percentage: likeCount / total }, { percentage: disLikeCount / total }];
}

/**
 * More detail please see post reaction function.
 * @param replyReactions
 */
function processReplyReaction(replyReactions: ReplyReactionObj[]): PercentageData[] {
  if (replyReactions.length === 0) {
    return [{ percentage: 0 }, { percentage: 0 }];
  }

  const likeCount = replyReactions.filter(value => value.type === REACTION_LIKE).length;
  const disLikeCount = replyReactions.length - likeCount;
  const total = replyReactions.length;

  return [{ percentage: likeCount / total }, { percentage: disLikeCount / total }];
}

/**
 * Check if all the data percentage are 0.
 * @param data
 */
function isPercentageAllZero(data: PercentageData[]): boolean {
  for (const each of data) {
    if (each.percentage !== 0) {
      return false;
    }
  }

  return true;
}

const INIT_DATA: PercentageData[] = [{ percentage: 0 }, { percentage: 0 }];

/**
 * Borrow from: https://recharts.org/en-US/examples/TwoSimplePieChart
 *
 **/
function GetPieLabel({
                       cx,
                       cy,
                       midAngle,
                       innerRadius,
                       outerRadius,
                       percent
                     }: any) {
  // Calculate the position base on the angle and current axis.

  // We first find the middle point for the sector or circle.
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;

  // The mid-angle is the angle value. We first need to convert it to radians.
  // Radian = angle * (pi / 180 degree).
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={'white'}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline={'central'}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function LanToolTip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <Box>
        {/* Show our version tool tip. */}
        <Paper sx={{ p: '1.5rem' }}>
          <Typography variant={'body1'}>
            <strong>{`${payload[0].name === 0 ? 'Like' : 'Dislike'}`}</strong>{` : ${payload[0].value}`}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return null;
}


export default function UserPostReactionChart() {
  const theme = useTheme();
  const [postReactionData, setPostReactionData] = useState<PercentageData[]>(INIT_DATA);
  const [replyReactionData, setReplyReactionData] = useState<PercentageData[]>(INIT_DATA);

  const navigate = useNavigate();

  useEffect(() => {
    const setData = async () => {
      try {
        // Get data, do further process and set to state.
        const postReactions = await getAllPostReactions();
        setPostReactionData(processPostReaction(postReactions));

        // For reply
        const replyReaction = await getAllReplyReactions();
        setReplyReactionData(processReplyReaction(replyReaction));
      } catch (e: unknown) {
        toErrorPageException(navigate, e);
      }
    };

    setData().catch(console.log);
  }, [navigate, setPostReactionData, setReplyReactionData]);

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
        Total user reaction percentage in this web application
      </ChartTitle>

      {
        // If all are zero.
        isPercentageAllZero(postReactionData) && isPercentageAllZero(replyReactionData)
          ? <MiddleText text={'These is nothing to show.'} />
          :
          <ResponsiveContainer
            width={'100%'}
            height={'100%'}
          >
            <PieChart
              height={350}
              margin={{
                top: 5,
                bottom: 5,
              }}
            >
              <Tooltip content={LanToolTip} />

              {/* Post reaction */}
              <Pie
                cx={
                  // Show one in middle.
                  !isPercentageAllZero(postReactionData) && isPercentageAllZero(replyReactionData)
                    ? '50%'
                    : '25%'
                }
                cy={'50%'}
                labelLine={false}
                data={postReactionData}
                label={GetPieLabel}
                dataKey={DATA_KEY}
              >
                {
                  postReactionData.map((value: PercentageData, index: number) => (
                    <Cell
                      key={`cell-${value.percentage}-${index}-${Date.now()}`}
                      fill={PINK_FOAM[index % PINK_FOAM.length]}
                    />
                  ))
                }
                <Label
                  value={'Post reactions'}
                  position={'outside'}
                  style={{
                    fill: theme.palette.text.primary,
                    ...theme.typography.body1,
                  }}
                />
              </Pie>

              {/* Reply Reaction */}
              <Pie
                cx={
                  // Show one in middle.
                  isPercentageAllZero(postReactionData) && !isPercentageAllZero(replyReactionData)
                    ? '50%'
                    : '75%'
                }
                cy={'50%'}
                labelLine={false}
                data={replyReactionData}
                label={GetPieLabel}
                dataKey={DATA_KEY}
              >
                {
                  replyReactionData.map((value: PercentageData, index: number) => (
                    <Cell
                      key={`cell-${value.percentage}-${index}-${Date.now()}`}
                      fill={PINK_FOAM[PINK_FOAM.length - 1 - (index % PINK_FOAM.length)]}
                    />
                  ))
                }
                <Label
                  value={'Reply reactions'}
                  position={'outside'}
                  style={{
                    fill: theme.palette.text.primary,
                    ...theme.typography.body1,
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
      }
    </Paper>
  );
}